# Fake Internship Detector

Fake Internship Detector is an AI-powered, full-stack application that analyzes internship and job postings for fraud signals. It combines a supervised ML model with Google Gemini to return a trust score, red flag breakdown, and plain-English verdict.

## Key Features
- ML-based fraud probability with calibrated trust score
- Red flag detection with severity levels
- Gemini-powered risk narrative and recommendation
- File upload for PDF, DOCX, and TXT postings
- Authenticated reporting and history dashboard

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React (Vite), Tailwind CSS, Axios, React Router |
| Backend | FastAPI, Motor (MongoDB), JWT Auth |
| ML | Scikit-learn, NLTK, Imbalanced-learn, Scipy |
| AI | Google Gemini 1.5 Flash |
| Database | MongoDB |

## Project Structure
fake-internship-detector/
├── frontend/
├── backend/
├── ml/
└── docs/

## How It Works
1. A posting is submitted through the UI or uploaded from a file.
2. The backend extracts and cleans text, builds structured features, and runs the ML model.
3. Gemini analyzes the posting with the ML score as context.
4. The API returns a combined verdict, trust score, and red flag list.

## ML Pipeline

### Dataset
The model is trained on EMSCAD (Employment Scam Arabic Dataset). The source file is ml/dataset/raw/fake_job_postings.csv and processed splits are in ml/dataset/processed/.

Class distribution:
- Legitimate: 17,014 (95.16%)
- Fraudulent: 866 (4.84%)

### Feature Engineering
The shared feature builder is in ml/features/feature_builder.py and is used by both training and inference. It includes:
- Text normalization and lemmatization
- Red flag keyword counts
- Structured signals (missing fields, text lengths, employment type)
- TF-IDF features on cleaned text

### Training
Training is implemented in ml/train.py and includes TF-IDF vectorization, SMOTE balancing, and a GradientBoostingClassifier. The script exports:
- backend/ml_models/scam_detector.pkl
- backend/ml_models/vectorizer.pkl

## API Overview
Base URL: http://127.0.0.1:8000

Key endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/analyze
- POST /api/upload
- GET /api/reports
- POST /api/reports
- DELETE /api/reports/{id}

Interactive docs are available at http://127.0.0.1:8000/docs.

## Local Setup

### Prerequisites
- Python 3
- Node.js with npm
- A MongoDB instance (Atlas or local)

### 1) Install dependencies
```bash
cd backend
pip install -r requirements.txt

cd ../ml
pip install -r requirements.txt

cd ../frontend
npm install
```

### 2) Configure environment
Create backend/.env with the following values:
```env
GEMINI_API_KEY=your_key
MONGO_URI=your_mongodb_uri
DB_NAME=internship_detector
SECRET_KEY=your_jwt_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3) Train the model
```bash
cd ml
python train.py
```

### 4) Run the services
```bash
cd backend
uvicorn app:app --reload

cd ../frontend
npm run dev
```
