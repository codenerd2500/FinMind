# FinMind

FinMind is a full-stack web application featuring a React frontend and a FastAPI Python backend. The application is fully containerized using Docker and optimized for deployment on Google Cloud Run.

## 🛠️ Tech Stack

* [cite_start]**Frontend:** React (Node.js 20 environment) 
* [cite_start]**Backend:** FastAPI (Python 3.11 environment) 
* [cite_start]**Server:** Uvicorn 
* [cite_start]**Containerization:** Docker (Multi-stage build) 
* **Deployment Target:** Google Cloud Platform (Cloud Run)

## 📁 Project Structure

* [cite_start]`frontend/`: Contains the React user interface, configuration, and frontend dependencies (`package.json`). 
* [cite_start]`backend/`: Contains the FastAPI application logic and Python requirements (`requirements.txt`). 
* [cite_start]`Dockerfile`: Instructions for building the unified application container. 
* [cite_start]`.dockerignore` / `.gcloudignore`: Configurations to exclude local environments (`venv/`, `node_modules/`), caches (`__pycache__/`), and sensitive files (`.env`) from production builds. [cite: 1, 2]

## 💻 Local Development Setup

To run this project locally for development, you will need to run the frontend and backend separately.

### Prerequisites
* Node.js (v20+ recommended)
* Python (v3.11+ recommended)

### 1. Backend Setup
Navigate to the backend directory, install the dependencies, and start the local server:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

2. Frontend Setup
Open a new terminal window, navigate to the frontend directory, install dependencies, and start the Vite/Create React App server:

Bash
cd frontend
npm install
npm run dev
🐳 Docker Build & Production Architecture
This project uses a multi-stage Dockerfile to keep the final image lightweight and secure:


Build Stage (Frontend): Compiles the React application into production-ready static files using npm run build.   


Final Stage (Backend): Sets up a lean Python 3.11 image and installs the necessary backend dependencies via pip install --no-cache-dir.   


Integration: The compiled frontend UI (frontend/dist) is copied directly into the backend's static directory.  FastAPI handles serving both the API routes and the React static files.  

Running with Docker Locally
To test the production build on your local machine:
docker build -t finmind-app .
docker run -p 8080:8080 finmind-app
