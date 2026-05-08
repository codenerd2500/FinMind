from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os

app = FastAPI(title="FinMind API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Routes (must be defined BEFORE static file mount) ---

@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}

@app.post("/api/chat")
async def chat(message: dict):
    # Placeholder for LangChain orchestration
    return {"response": f"Concierge received: {message.get('text')}", "agent": "Concierge"}

# --- Serve React frontend ---
# Mount the built React app. All API routes above are registered first,
# so they take priority. The SPA catch-all handles client-side routing.

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

if os.path.isdir(STATIC_DIR):
    # Mount static assets (js, css, images etc.)
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

    # Catch-all: serve index.html for any unmatched route (SPA support)
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        index = os.path.join(STATIC_DIR, "index.html")
        return FileResponse(index)
else:
    @app.get("/")
    def read_root():
        return {"message": "Welcome to FinMind AI Finance Platform API (no frontend built yet)"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
