# Phishing URL Detection System 🛡️

A full-stack, real-time phishing detection platform using a ensemble of Machine Learning models and a responsive React dashboard.

## 🚀 Overview
This system analyzes URLs for phishing indicators by running them through three distinct ML models and using a consensus-based voting system. It includes a FastAPI backend for real-time inference and a React-based security dashboard for monitoring threats.

### Key Features
- **Multi-Model Consensus**: Uses Logistic Regression, Naive Bayes, and XGBoost models for higher accuracy.
- **Real-Time Analysis**: Instant URL scanning results with confidence scores.
- **Security Dashboard**: Historical scan tracking and live threat trends.
- **Cyber-Aesthetic UI**: A modern, dark-mode terminal-inspired interface.
- **MySQL Integration**: Persistent storage of scan results and model performance data.

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Lucide-React, Recharts.
- **Backend**: FastAPI (Python 3.12), SQLAlchemy, Pydantic v2, Uvicorn.
- **ML/DS**: Scikit-Learn, XGBoost, Pandas, Numpy.
- **Database**: MySQL.

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Python 3.10+
- Node.js & npm
- MySQL Server

### 2. Database Setup
1. Create a MySQL database:
   ```sql
   CREATE DATABASE phishing_db;
   ```
2. The tables will be automatically created by SQLAlchemy on the first run of the backend.

### 3. Backend Setup
1. Navigate to the `backend/` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # Windows: .\env\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` folder (use `.env.example` as a template).
5. Start the server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

### 4. Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure
- `backend/app/`: Core FastAPI application logic.
- `backend/app/models/`: ML Model loading and database schemas.
- `backend/app/services/`: Inference logic and feature engineering.
- `frontend/src/pages/`: UI pages for scanning and dashboard.
- `frontend/src/components/`: Reusable UI components.

---

## 🛡️ Future Work: Snort IDS Integration
The repository includes a conceptual plan for **Snort IDS Integration**, which will allow the system to ingest real-time network intrusion logs and display them on the dashboard alongside the phishing data.

---

## 📜 License
This project is licensed under the MIT License.
