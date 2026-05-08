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
