## Project Overview
Fake Internship Detector is an AI-powered full-stack web application that analyzes internship and job postings for fraud signals. It combines a trained Machine Learning model with Google Gemini AI to produce a trust score, red flag breakdown, and a plain-English verdict for any posting.

## Tech Stack

Frontend — React (Vite), Tailwind CSS v3, Axios, React Router
Backend — FastAPI (Python), Motor (async MongoDB), JWT Auth
ML — Scikit-learn, NLTK, Imbalanced-learn, Scipy
AI — Google Gemini 2.5 Flash
Database — MongoDB Atlas


## Project Structure
fake-internship-detector/
├── frontend/
├── backend/
├── ml/
└── docs/

## ML Folder — ml/
Dataset
The model was trained on the EMSCAD (Employment Scam Arabisc Dataset) — fake_job_postings.csv containing 17,880 real-world job postings collected from various platforms with the following distribution:

Legitimate postings — 17,014 (95.16%)
Fraudulent postings — 866 (4.84%)

Raw data lives in ml/dataset/raw/ and processed train/test splits in ml/dataset/processed/.

## Feature Engineering — ml/features/feature_builder.py
This is the most critical file in the ML pipeline. It is shared between training and the backend inference so that both use identical features.
It does three things:
Text Cleaning — The clean_text() function lowercases the text, strips URLs and special characters, removes stopwords using NLTK, and lemmatizes remaining tokens using WordNetLemmatizer.
Red Flag Detection — The count_red_flags() function scans posting text for 30+ predefined suspicious keywords such as whatsapp, western union, commission only, guaranteed income, pyramid, unlimited earnings, no experience needed, and more.
Feature Building — The build_features() function takes a raw DataFrame and produces a feature matrix with the following categories:

Structural binary signals — has_company_logo, has_questions, telecommuting
Missing field indicators — missing_salary, missing_company_profile, missing_requirements, missing_benefits, missing_education, missing_experience, missing_industry, missing_location
Text length signals — desc_length, req_length, profile_length
Red flag count — red_flag_count
Employment type one-hot encoding — emp_Full-time, emp_Part-time, emp_Contract, emp_Temporary, emp_Other, emp_Unknown
Combined cleaned text — used for TF-IDF vectorization


## Training — ml/train.py
This script trains the fraud detection model end to end.
Step 1 — Load Data — Reads fake_job_postings.csv from the raw dataset folder.
Step 2 — Feature Engineering — Calls build_features() from feature_builder.py to produce structured features and a cleaned text column.
Step 3 — Train/Test Split — Uses stratified splitting (80/20) to preserve the 4.84% fraud ratio in both train and test sets.
Step 4 — TF-IDF Vectorization — Fits a TfidfVectorizer with max_features=5000 and ngram_range=(1,2) (unigrams + bigrams) on the training text. This captures both individual words and two-word phrases like "no experience" or "work from home".
Step 5 — Feature Combination — The TF-IDF sparse matrix and structured feature matrix are combined using scipy.sparse.hstack into a single combined matrix.
Step 6 — SMOTE — Since only 4.84% of postings are fraudulent, the training set is heavily imbalanced. SMOTE (Synthetic Minority Oversampling Technique) from imbalanced-learn generates synthetic fraud samples to balance the classes before training.
Step 7 — Model Training — A GradientBoostingClassifier is trained with n_estimators=200, learning_rate=0.1, and max_depth=5.
Step 8 — Evaluation — Prints a full classification report with precision, recall, and F1-score for both classes on the held-out test set.
Step 9 — Export — Saves scam_detector.pkl and vectorizer.pkl to backend/ml_models/ for the backend to load at runtime.

Model — Gradient Boosting Classifier
Gradient Boosting was chosen over simpler models because:

It handles mixed feature types well (sparse TF-IDF + dense structured features)
It builds trees sequentially, each correcting the errors of the previous one
It produces well-calibrated probability scores via predict_proba() which we use as the raw fraud probability
It performs strongly on imbalanced classification tasks when combined with SMOTE


Evaluation — ml/evaluate.py
Loads the saved model and vectorizer and runs a full evaluation on the entire dataset reporting precision, recall, F1-score, confusion matrix, and ROC-AUC score. Used to verify model quality after retraining.

Key Metrics (approximate on test set)
ClassPrecisionRecallF1-ScoreLegitimate~0.98~0.97~0.97Fraudulent~0.75~0.82~0.78ROC-AUC~0.96

## Backend — backend/
The backend is built with FastAPI — a modern async Python web framework. It runs on uvicorn and exposes a REST API consumed by the React frontend.

## How FastAPI Works Here
app.py is the entry point. It creates the FastAPI application, registers CORS middleware to allow the React frontend at localhost:5173 to make requests, and mounts four routers — auth, analyze, upload, and reports — each under their respective /api/ prefix.
FastAPI uses a lifespan context manager to run startup and shutdown logic. On startup it connects to MongoDB Atlas and initializes collection indexes. On shutdown it closes the connection cleanly.
FastAPI also auto-generates interactive API documentation at http://127.0.0.1:8000/docs using Swagger UI — every endpoint, request body, and response schema is documented automatically from Pydantic models.

## config.py
Loads all environment variables from .env using pydantic-settings. Uses @lru_cache so the file is read once and reused across the entire app. Contains Gemini API key, MongoDB URI, DB name, JWT secret key, algorithm, and token expiry settings.

## database/mongodb.py
Manages the async MongoDB connection using motor — the async driver for MongoDB. Exposes connect_db() and close_db() called at startup/shutdown, and get_db() used by all routes to access the database.
database/schema.py
Defines collection names and creates indexes on startup — unique index on users.email, and indexes on analyses.user_id, reports.user_id, and reports.created_at for fast lookups.

schemas/
Pydantic models that define the shape of every request and response. FastAPI uses these for automatic validation and serialization.

user.py — UserRegister, UserLogin, UserResponse, TokenResponse
posting.py — PostingInput (the full form a user fills), RedFlag, AnalysisResult (the full verdict returned to frontend)
report.py — ReportCreate, ReportResponse


services/
nlp_service.py — Extracts and cleans text from a PostingInput object, detects red flags by scanning for suspicious keywords, assigns severity levels (high/medium/low) to each flag, and counts missing fields. It reuses clean_text() and RED_FLAG_KEYWORDS from the ML feature builder so training and inference are consistent.
score_service.py — Loads scam_detector.pkl and vectorizer.pkl once at module import. When called, it builds the structured feature vector for the posting, vectorizes the cleaned text with TF-IDF, combines both into a sparse matrix, runs predict_proba() to get a fraud probability, and calculates the final trust score (0–100) by inverting the ML probability and applying penalties for red flags and missing fields.
gemini_service.py — Configures the Gemini 1.5 Flash model using the API key from config. Builds a detailed prompt with all posting fields and the ML fraud probability, sends it to Gemini, and parses the JSON response containing risk_level, is_fake, gemini_analysis, and recommendation. Includes fallback handling if Gemini returns non-JSON or fails.

routes/
auth.py — Handles user registration, login, and fetching the current user. Passwords are hashed with bcrypt via passlib. Login returns a JWT token signed with the secret key. The get_current_user() dependency decodes the token and fetches the user from MongoDB — it is injected into any route that requires authentication.
analyze.py — The core route. Accepts a PostingInput, runs run_ml_analysis() to get the ML score and red flags, then calls analyze_with_gemini() to get the AI verdict, combines both into an AnalysisResult, saves it to the analyses collection in MongoDB, and returns it to the frontend.
upload.py — Accepts a file upload (PDF, DOCX, or TXT). Extracts raw text using pdfplumber for PDFs and python-docx for DOCX files. Returns the extracted text as a PostingInput object pre-filled with the description field so the user can review and submit it for analysis.
reports.py — Three endpoints: POST /reports saves a completed analysis as a report tied to the current user, GET /reports returns all reports for the current user sorted by date, and DELETE /reports/{id} deletes a specific report after verifying ownership.

middleware/
Reserved for rate limiting middleware to prevent abuse of the analyze endpoint which makes external API calls to Gemini. Not yet implemented but the folder is in place.

## Frontend — frontend/
Built with React and Vite. Uses React Router for client-side routing with protected routes that redirect unauthenticated users to the home page. Axios is configured with a base URL and an interceptor that automatically attaches the JWT token to every request.

Home — Login and register page with a split layout showing features on the left and the auth form on the right
Dashboard — Shows the user's name, total analyses, fake count, safe count, average trust score, and the five most recent reports
Analyze — The main page with a manual form and file upload tab. Submits to the backend and displays trust score (circular gauge), risk card, Gemini explanation, red flag list with severity, and ML fraud probability bar. Results can be saved as reports
Reports — Full list of saved reports with search and filter (all/fake/safe), trust score progress bar, risk and fake/legit badges, and delete functionality



## Running the Project
bash# Train the ML model first
cd ml
python train.py

# Start backend
cd backend
uvicorn app:app --reload

# Start frontend
cd frontend
npm run dev
