# CYBERGUARD — Full Project Explanation for Mentor Presentation

> A full-stack cybersecurity intelligence platform with real-time threat monitoring, ML-powered phishing detection, network scanning, and live packet analysis.

---

## 1. Project Overview

**CYBERGUARD** is a full-stack web application that simulates a real-world Security Operations Center (SOC) dashboard. It combines:

- **Machine Learning** (3 trained models) for phishing URL detection
- **A REST API backend** (FastAPI + Python) with a MySQL database
- **A modern React frontend** with real-time data
- **WebSockets** for live network packet streaming
- **External API integration** (Have I Been Pwned)

The system is split into two independently running servers:

| Server | Technology | Port | Start Command |
|--------|-----------|------|--------------|
| Backend | Python / FastAPI / Uvicorn | `8000` | `python -m uvicorn app.main:app --reload` |
| Frontend | React / Vite / TypeScript | `5173` | `npm run dev` |

---

## 2. Technology Stack — Complete Breakdown

### 🐍 Backend

| Library | Version | Purpose |
|---------|---------|---------|
| **FastAPI** | 0.110.0 | Web framework — creates all REST API endpoints and WebSocket |
| **Uvicorn** | 0.28.0 | ASGI server — use `uvicorn[standard]` for WebSocket support |
| **websockets** | 16.0 | Handles the low-level WebSocket protocol |
| **SQLAlchemy** | 2.0.28 | ORM — maps Python classes to MySQL tables |
| **PyMySQL** | 1.1.0 | MySQL database driver/connector for Python |
| **Pydantic** | 2.6.4 | Data validation — validates request/response schemas |
| **pydantic-settings** | 2.2.1 | Loads config from `.env` file |
| **scikit-learn** | 1.6.1 | Provides Logistic Regression, Naive Bayes models + TF-IDF vectorizer |
| **XGBoost** | 2.0.3 | Gradient-boosted tree ML model |
| **Pandas** | 2.2.1 | Data manipulation (for ML input formatting) |
| **python-dotenv** | 1.0.1 | Loads `.env` environment variables |

### ⚛️ Frontend

| Library | Purpose |
|---------|---------|
| **React 18** | UI component library |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Ultra-fast build tool / dev server |
| **React Router DOM** | Client-side page routing (SPA navigation) |
| **Recharts** | Charts — AreaChart, PieChart, BarChart |
| **Lucide React** | Icon library (Shield, Bell, Fish, etc.) |
| **TanStack React Query** | Server state management (QueryClient) |
| **shadcn/ui** | Pre-built component primitives (Sidebar, Toaster, Tooltip) |
| **Tailwind CSS** | Utility-first CSS framework |

### 🗄️ Database

- **MySQL** — Relational database running locally
- Database name: `phishing_db`
- Connected via: `mysql+pymysql://root:@localhost:3306/phishing_db`

---

## 3. Project Folder Structure

```
CYBERGUARD/
├── backend/                    ← Python FastAPI Server
│   ├── .env                    ← Secret configs (DB password, etc.)
│   ├── requirements.txt        ← Python dependencies
│   ├── test_ws.py              ← WebSocket connection test script
│   ├── nb (1).pkl              ← Trained Naive Bayes model (serialized)
│   ├── phishing (1).pkl        ← Trained Logistic Regression model (serialized)
│   ├── xgb (1).pkl             ← Trained XGBoost model (serialized)
│   ├── vectorizer (1).pkl      ← Shared TF-IDF vectorizer (serialized)
│   └── app/
│       ├── main.py             ← App entry point: CORS, routers, startup task
│       ├── config.py           ← Settings class, DB URL builder
│       ├── database/
│       │   ├── db.py           ← SQLAlchemy engine, session, get_db dependency
│       │   ├── models.py       ← All ORM table definitions
│       │   └── crud.py         ← DB create/read operations
│       ├── models/
│       │   └── model_loader.py ← Loads all 3 ML models + vectorizer at startup
│       ├── routes/             ← API endpoint handlers (one file per feature)
│       │   ├── predict.py      ← POST /api/predict-url
│       │   ├── alerts.py       ← GET  /api/alerts
│       │   ├── history.py      ← GET  /api/history
│       │   ├── scanner.py      ← POST /api/scan
│       │   ├── stats.py        ← GET  /api/stats
│       │   ├── password.py     ← POST /api/password/check
│       │   ├── logs.py         ← GET  /api/logs/summary, /api/logs/export
│       │   └── packets.py      ← WebSocket /ws/packets
│       ├── services/           ← Business logic layer
│       │   ├── prediction_service.py  ← ML inference + majority voting
│       │   ├── alert_service.py       ← IDS alert simulation + DB save
│       │   ├── scanner_service.py     ← Port scan simulation
│       │   ├── password_service.py    ← Have I Been Pwned API integration
│       │   └── feature_service.py     ← URL preprocessing
│       └── schemas/
│           └── schemas.py      ← Pydantic request/response models
│
├── frontend/
│   └── src/
│       ├── App.tsx             ← Root: routing, providers setup
│       ├── main.tsx            ← React DOM entry point
│       ├── index.css           ← Global styles + CSS variables
│       ├── components/
│       │   ├── AppSidebar.tsx  ← Collapsible navigation sidebar
│       │   ├── DashboardLayout.tsx ← Wraps all pages with sidebar
│       │   ├── DashboardHeader.tsx ← Top header bar
│       │   └── NavLink.tsx     ← Active-state aware nav link
│       └── pages/
│           ├── DashboardPage.tsx      ← Stats + charts + recent scans
│           ├── PhishingPage.tsx       ← URL scanner with 3-model results
│           ├── IDSAlertsPage.tsx      ← Auto-refreshing security alerts table
│           ├── NetworkScannerPage.tsx ← Port scanner UI
│           ├── PacketAnalyzerPage.tsx ← Live WebSocket packet table
│           ├── PasswordCheckerPage.tsx← Password strength + HIBP check
│           └── LogsPage.tsx           ← Log summary + CSV export
│
└── notebooks/                  ← (Placeholder for ML training notebooks)
```

---

## 4. Database Design (MySQL via SQLAlchemy ORM)

There are **5 tables** auto-created by SQLAlchemy when the server starts (`Base.metadata.create_all()`):

```
┌──────────────────┐     ┌─────────────────────┐
│  phishing_inputs │     │  phishing_results    │
│──────────────────│1──∞ │─────────────────────│
│ id (PK)          │     │ id (PK)              │
│ url              │     │ input_id (FK)        │
│ timestamp        │     │ model_name           │
└──────────────────┘     │ prediction           │
                         │ confidence           │
                         └─────────────────────┘

┌──────────────────┐
│ security_alerts  │
│──────────────────│
│ id (PK)          │
│ timestamp        │
│ message          │
│ protocol         │
│ src_ip           │
│ dst_ip           │
│ severity         │
│ is_phishing      │
└──────────────────┘

┌──────────────────┐     ┌─────────────────┐
│  network_scans   │1──∞ │   port_scans    │
│──────────────────│     │─────────────────│
│ id (PK)          │     │ id (PK)         │
│ target           │     │ scan_id (FK)    │
│ hostname         │     │ port            │
│ timestamp        │     │ service         │
│ overall_risk     │     │ state           │
└──────────────────┘     │ risk            │
                         └─────────────────┘
```

**Relationships:**
- One `phishing_input` → Many `phishing_results` (one result per model: LR, NB, XGB)
- One `network_scan` → Many `port_scans` (one row per discovered port)

---

## 5. Machine Learning — Phishing Detection Engine

### How the Models Were Built
The three models were trained using a **labeled phishing URL dataset**, text-vectorized with **TF-IDF** (Term Frequency-Inverse Document Frequency), which converts raw URL strings into numerical feature vectors. The trained models are saved as `.pkl` (pickle) files — Python's binary serialization format.

### The 3 Models

| Model | `.pkl` File | Algorithm | sklearn class |
|-------|------------|-----------|--------------|
| **LR** — Logistic Regression | `phishing (1).pkl` | Binary linear classifier | `LogisticRegression` |
| **NB** — Naive Bayes | `nb (1).pkl` | Probabilistic text classifier | `MultinomialNB` |
| **XGB** — XGBoost | `xgb (1).pkl` | Gradient-boosted trees | `XGBClassifier` |
| **Vectorizer** | `vectorizer (1).pkl` | TF-IDF text→numbers | `TfidfVectorizer` |

### How a Prediction is Made (Step-by-Step)

```
User types URL  →  POST /api/predict-url
        ↓
1. URL Validation (regex check)
        ↓
2. FeatureService.preprocess_url()  →  strips whitespace
        ↓
3. TF-IDF Vectorizer.transform([url])  →  sparse numeric matrix
        ↓
4. Three parallel predictions:
   LR model.predict()  →  0 or 1
   NB model.predict()  →  0 or 1
   XGB model.predict() →  0 or 1
   (each also provides .predict_proba() for confidence %)
        ↓
5. LABEL CONVENTION: 0 = Phishing, 1 = Legitimate
   (note: this is reversed from the usual convention)
        ↓
6. Majority Voting:
   ≥1 model flags phishing → final = "Phishing"
   0 models flag phishing  → final = "Legitimate"
        ↓
7. Result saved to MySQL (phishing_inputs + phishing_results tables)
        ↓
8. JSON response sent to frontend
```

### Frontend Score Calculation
The frontend maps votes to a risk score:
- 3/3 models flag phishing → Score: **98** → Status: 🔴 **Phishing**
- 2/3 models flag phishing → Score: **75** → Status: 🔴 **Phishing**
- 1/3 models flag phishing → Score: **30** → Status: 🟡 **Suspicious**
- 0/3 models flag phishing → Score: **5**  → Status: 🟢 **Safe**

---

## 6. All API Endpoints

### REST Endpoints (HTTP)

| Method | Endpoint | Description | Feature |
|--------|----------|-------------|---------|
| `GET` | `/` | Health check | Core |
| `POST` | `/api/predict-url` | Run URL through 3 ML models | Phishing Detection |
| `GET` | `/api/history?limit=N` | Get past phishing scan history | History |
| `GET` | `/api/alerts?limit=N` | Get IDS security alerts | IDS |
| `GET` | `/api/stats` | Total counts (phishing, alerts, scans) | Dashboard |
| `POST` | `/api/scan` | Scan an IP/domain for open ports | Network Scanner |
| `POST` | `/api/password/check` | Check password against breach database | Password |
| `GET` | `/api/logs/summary` | Count of all log entries | Logs |
| `GET` | `/api/logs/export?type=X` | Download data as CSV file | Logs Export |

### WebSocket Endpoint

| Protocol | Endpoint | Description |
|----------|----------|-------------|
| `WS` | `/ws/packets` | Streams simulated network packets every 0.8 seconds |

---

## 7. How Each Feature Works End-to-End

### 7a. Phishing Detection (Core Feature)
```
Frontend (PhishingPage.tsx)
  └── User enters URL → fetch POST /api/predict-url
        └── predict.py router validates URL with regex
              └── prediction_service.py runs inference on 3 models
                    └── crud.py saves result to MySQL
                          └── JSON response with votes + per-model confidence
                                └── Frontend renders risk score bar + model cards
```

### 7b. IDS Alerts (Intrusion Detection Simulation)
- At **server startup**, an `asyncio` background task runs every **15 seconds**
- It randomly picks one of 8 predefined Snort-style signatures and inserts a new `SecurityAlert` row into MySQL
- Signatures include: SSH brute force, phishing attempts, Nmap scans, Trojan callbacks, etc.
- **Frontend polls** `GET /api/alerts` every **5 seconds** and updates the table
- Alerts with `is_phishing=1` are highlighted in red

### 7c. Network Scanner
```
Frontend (NetworkScannerPage.tsx)
  └── User enters IP/domain → fetch POST /api/scan
        └── scanner_service.py simulates a port scan:
              - Picks 3–6 random ports from a list of 8 common ports
              - Assigns risk level (FTP/MySQL = High, SSH = Medium, HTTP = Low)
              - Calculates overall risk
        └── crud.py saves scan + ports to MySQL
              └── Results displayed in a styled table
```

### 7d. Packet Analyzer (Real-Time WebSocket)
```
Frontend (PacketAnalyzerPage.tsx)
  └── Opens WebSocket: ws://localhost:8000/ws/packets
        └── packets.py (backend) sends JSON every 0.8 seconds:
              { id, timestamp, srcIp, dstIp, protocol, length, info }
        └── Frontend keeps last 50 packets, updates:
              - Live scrolling table
              - Bar chart showing protocol distribution (TCP, UDP, HTTP, etc.)
        └── Stop button closes WebSocket, Start reopens it
```

### 7e. Password Strength + Have I Been Pwned
```
Frontend (PasswordCheckerPage.tsx)
  └── Password typed → 800ms debounce → fetch POST /api/password/check
        └── password_service.py:
              1. SHA-1 hash the password
              2. Take first 5 characters (prefix) → send to external API
              3. GET https://api.pwnedpasswords.com/range/{prefix}
              4. API returns all hashes starting with prefix (k-Anonymity)
              5. Compare suffix locally → count matches
              6. Return breach count to frontend
        └── Frontend shows "Exposed in X breaches!" or "Safe"
        └── Also: local 7-rule strength checks + suggestions (no API needed)
```

> [!IMPORTANT]
> **k-Anonymity Privacy**: The actual password is NEVER sent over the network. Only the first 5 characters of its SHA-1 hash are sent. The comparison happens locally. This is the same algorithm used by major password managers.

### 7f. Dashboard
- Fetches `GET /api/history` (last 10 scans) + `GET /api/stats` simultaneously in parallel with `Promise.all()`
- Polls both every **10 seconds**
- Shows: stat cards, Recharts Area chart (weekly threat trends), Pie chart (attack type distribution), and recent phishing scans table

### 7g. Logs & Reports
- Fetches `GET /api/logs/summary` — returns live counts from MySQL
- CSV download button calls `GET /api/logs/export?type=alerts|phishing|network|all`
- Backend queries the DB and streams a CSV file using Python's `io.StringIO` + `csv.writer`

---

## 8. Configuration & Environment

### `.env` File (backend)
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=phishing_db
```
The `config.py` file uses **pydantic-settings** to auto-read this file and constructs the database URL:
```
mysql+pymysql://root:password@localhost:3306/phishing_db
```

### CORS Configuration
CORS (Cross-Origin Resource Sharing) is enabled in `main.py` with `allow_origins=["*"]` so the React frontend (port 5173) can send requests to the backend (port 8000) without being blocked by the browser's same-origin policy.

---

## 9. Frontend Architecture

### Routing (React Router)
All pages live under a shared `DashboardLayout` wrapper which includes the sidebar + header. Routes defined in `App.tsx`:

| URL Path | Page Component | Feature |
|----------|---------------|---------|
| `/` | `DashboardPage` | Overview stats + charts |
| `/phishing` | `PhishingPage` | URL scanner |
| `/ids-alerts` | `IDSAlertsPage` | Security alerts |
| `/network-scanner` | `NetworkScannerPage` | Port scanner |
| `/packet-analyzer` | `PacketAnalyzerPage` | Live packets |
| `/password-checker` | `PasswordCheckerPage` | Password audit |
| `/logs` | `LogsPage` | Reports & export |
| `/settings` | `SettingsPage` | App settings |

### Design System
- **Dark cyber aesthetic** with CSS custom properties (HSL colors)
- **CSS class `cyber-card`** — reusable glassmorphism card style
- **Monospace font** (`font-mono`) for all technical data
- **Lucide icons** throughout the interface
- **Recharts** for interactive data visualizations
- Smooth animations: `animate-fade-in`, `animate-pulse`, `animate-spin`

### Data Fetching Pattern
Pages use React's `useEffect` + native `fetch()` API. Repeated data (alerts, dashboard) uses `setInterval()` polling. WebSocket pages use `useRef<WebSocket>` to maintain the connection reference.

---

## 10. How to Run the Project

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL Server running locally

### Backend
```bash
cd CYBERGUARD/backend
# Create virtual environment
python -m venv env
env\Scripts\activate           # Windows
# Install dependencies
pip install -r requirements.txt
# Start server
python -m uvicorn app.main:app --reload
# → Running at http://localhost:8000
# → API docs at http://localhost:8000/docs
```

### Frontend
```bash
cd CYBERGUARD/frontend
npm install
npm run dev
# → Running at http://localhost:5173
```

### Database Setup
Ensure MySQL is running and the database `phishing_db` exists. SQLAlchemy will **auto-create all tables** on first startup — no manual SQL migrations needed.

---

## 11. Key Design Decisions (For Mentor Discussion)

| Decision | Reasoning |
|----------|-----------|
| **3 ML models instead of 1** | Ensemble / majority voting reduces false positives and improves robustness |
| **Label convention: 0=Phishing, 1=Legitimate** | Dataset-specific encoding from training phase |
| **Sensitivity: 1+ votes → flag as suspicious** | Security-first: better to over-alert than miss real threats |
| **Simulated IDS alerts** | Real Snort/network capture requires root privileges; simulation demonstrates the concept |
| **Simulated port scanner** | Real nmap requires OS privileges and network access; simulation demonstrates UI concept |
| **k-Anonymity for HIBP** | Privacy-preserving breach check — actual password never leaves the client |
| **SQLAlchemy ORM** | Database-agnostic — can swap MySQL for PostgreSQL/SQLite with one config change |
| **Auto-table creation** | `Base.metadata.create_all()` on startup simplifies dev setup |
| **Polling vs WebSocket** | WebSocket used only where real-time streaming is essential (packets); polling sufficient for alerts/stats |
| **Singleton model loader** | ML models are large (5–11 MB each); loaded once at startup and reused across all requests |

---

## 12. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                      │
│   Port 5173  –  Browser                                          │
│                                                                  │
│  Dashboard ──── fetch (10s poll) ──────────────────────────────┐ │
│  PhishingPage ── POST /api/predict-url ──────────────────────┐ │ │
│  IDSAlerts ───── GET  /api/alerts (5s poll) ───────────────┐ │ │ │
│  NetworkScanner ─ POST /api/scan ─────────────────────────┐│ │ │ │
│  PacketAnalyzer ─ WebSocket ws://localhost:8000/ws/packets ││ │ │ │
│  PasswordChecker ─POST /api/password/check ───────────────┘│ │ │ │
│  LogsPage ────── GET /api/logs/summary + /export ──────────┘ │ │ │
└──────────────────────────────────────────────────────────────┼─┘─┘
                          HTTP / WebSocket                     │
┌─────────────────────────────────────────────────────────────▼────┐
│                   BACKEND (FastAPI + Uvicorn)                     │
│   Port 8000  –  Python Server                                    │
│                                                                  │
│  Routes Layer ─ predict.py, alerts.py, scanner.py, etc.          │
│       │                                                          │
│  Services Layer ─ prediction_service, alert_service, etc.        │
│       │                    │                                     │
│  ML Models       External APIs          Database Layer           │
│  (LR, NB, XGB)   (HIBP API)            (SQLAlchemy ORM)          │
│  .pkl files       pwnedpasswords.com    ↕                        │
│                                    MySQL :3306                    │
│                                    phishing_db                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 13. Security Concepts Demonstrated

| Concept | Where Used |
|---------|-----------|
| **Phishing URL Detection** | ML models in `/api/predict-url` |
| **Intrusion Detection System (IDS)** | Simulated Snort alerts, auto-generated in background |
| **Network Port Scanning** | Simulated nmap-style scan in `/api/scan` |
| **Packet Capture Analysis** | WebSocket streaming with protocol breakdown |
| **Data Breach Checking** | HIBP k-Anonymity API integration |
| **Password Strength Analysis** | 7-rule local checker with suggestions |
| **Security Logging** | All events persisted to MySQL, exportable as CSV |
| **REST API Security** | CORS configuration, input validation with Pydantic/regex |

---

## 14. Troubleshooting & Operational Notes

### ⚠️ Moving the Project Folder
If you move the project or rename its parent folder (e.g., from `PHISHING URL DETECTION` to `CYBERGUARD`), the virtual environment (`env`) will break because it uses **absolute paths**.
- **Symptoms**: `pip` fails to find packages, or `uvicorn` throws module errors.
- **Fix**: Delete the `env` folder and recreate it using `python -m venv env` then re-install requirements.

### 🌐 WebSocket 404 Errors
WebSockets in FastAPI require the `uvicorn[standard]` package. If you get a 404 on the `/ws/packets` endpoint even when the path is correct, ensure `websockets` is installed in your current environment.

---

## 15. Project Roadmap (Phase 3)

The next stage of **CYBERGUARD** focuses on advanced intelligence:

1. **🤖 AI Security Assistant**: An integrated LLM chatbot to explain complex IDS alerts and suggest remediation steps.
2. **🦠 Malware Analysis Sandbox**: A static analysis tool to inspect uploaded file hashes against threat intelligence databases.
3. **📊 System Health Dashboard**: Real-time monitoring of API latency, database connection health, and worker threads.
