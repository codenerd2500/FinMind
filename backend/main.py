from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn
import os

# LangChain + Google Gemini
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

app = FastAPI(title="FinMind API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini model
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

def get_llm():
    if not GEMINI_API_KEY:
        return None
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=GEMINI_API_KEY,
        temperature=0.7,
    )

SYSTEM_PROMPT = """You are FinMind's AI Financial Concierge — a precision, data-driven personal finance assistant.
You help users understand their spending, investments, budgets, and financial goals.
You are knowledgeable about Indian markets, UPI payments, mutual funds, stocks, and personal finance.
Keep responses concise, analytical, and actionable. Use Indian Rupee (₹) for currency.
If the user provides transaction data or financial context, analyze it carefully.
Respond in a professional yet friendly tone. Use bullet points or structured formatting when helpful.
When you don't have specific user data, provide general best-practice financial advice tailored for Indian users."""

class ChatRequest(BaseModel):
    text: str
    context: dict = {}

class TransactionRequest(BaseModel):
    merchant: str
    amount: float
    category: str
    date: str
    note: str = ""

# In-memory store for user-added transactions (resets on restart)
user_transactions = []

# --- API Routes ---

@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0", "llm": "gemini-1.5-flash"}

@app.post("/api/chat")
async def chat(req: ChatRequest):
    llm = get_llm()
    if not llm:
        return {
            "response": "⚠️ Gemini API key not configured. Please set the GEMINI_API_KEY environment variable in Cloud Run.",
            "agent": "Concierge",
            "model": "unavailable"
        }

    # Build context string from user data
    context_str = ""
    if req.context:
        ctx = req.context
        if ctx.get("balance"):
            context_str += f"\nUser's current balance: ₹{ctx['balance']:,}"
        if ctx.get("monthlySpent") and ctx.get("monthlyBudget"):
            pct = round(ctx['monthlySpent'] / ctx['monthlyBudget'] * 100)
            context_str += f"\nMonthly spend: ₹{ctx['monthlySpent']:,} of ₹{ctx['monthlyBudget']:,} budget ({pct}% used)"
        if ctx.get("netWorth"):
            context_str += f"\nNet worth: ₹{ctx['netWorth']:,}"
        if ctx.get("portfolioValue"):
            context_str += f"\nPortfolio value: ₹{ctx['portfolioValue']:,}"

    if user_transactions:
        context_str += f"\nUser has {len(user_transactions)} manually added transactions."

    system_content = SYSTEM_PROMPT
    if context_str:
        system_content += f"\n\nUser's financial context:{context_str}"

    try:
        messages = [
            SystemMessage(content=system_content),
            HumanMessage(content=req.text),
        ]
        response = llm.invoke(messages)
        return {
            "response": response.content,
            "agent": "Concierge",
            "model": "gemini-1.5-flash"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM error: {str(e)}")

@app.post("/api/transactions")
async def add_transaction(tx: TransactionRequest):
    """Endpoint to add user transactions manually."""
    transaction = tx.dict()
    transaction["id"] = len(user_transactions) + 1
    user_transactions.append(transaction)
    return {"success": True, "transaction": transaction, "total": len(user_transactions)}

@app.get("/api/transactions")
async def get_transactions():
    """Retrieve all user-added transactions."""
    return {"transactions": user_transactions, "total": len(user_transactions)}

@app.get("/api/bank/connect")
async def bank_connect_info():
    """Returns information about bank connection options."""
    return {
        "providers": [
            {"id": "sbi", "name": "State Bank of India", "logo": "🏦", "status": "available"},
            {"id": "hdfc", "name": "HDFC Bank", "logo": "🏦", "status": "available"},
            {"id": "icici", "name": "ICICI Bank", "logo": "🏦", "status": "available"},
            {"id": "axis", "name": "Axis Bank", "logo": "🏦", "status": "available"},
            {"id": "kotak", "name": "Kotak Mahindra Bank", "logo": "🏦", "status": "coming_soon"},
        ],
        "message": "Bank connection uses Account Aggregator (AA) framework — read-only, RBI regulated."
    }

# --- Serve React frontend ---
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

if os.path.isdir(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        index = os.path.join(STATIC_DIR, "index.html")
        return FileResponse(index)
else:
    @app.get("/")
    def read_root():
        return {"message": "Welcome to FinMind AI Finance Platform API v2 (Gemini-powered)"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
