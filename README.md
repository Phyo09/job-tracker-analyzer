# job-tracker-analyzer
Full-stack job tracker with resume analyzer (Flask + React + Bootstrap)
# 🧠 Smart Job Tracker & Resume Analyzer

A full-stack application that helps job seekers track their job applications and analyze how well their resume matches a job description.

---

## 🚀 Features

### ✅ Job Tracker
- Add, view, edit, delete job applications
- Upload a resume for each job
- Search/filter by company, role, or status
- View and download uploaded resumes

### ✅ Resume Analyzer
- Upload your resume (PDF, text-based)
- Paste a job description
- Get a similarity score (based on NLP)
- See missing keywords as highlighted badges
- Preview full resume content directly in browser

---

## 🛠 Tech Stack

| Frontend       | Backend        | NLP / Analysis     | Database    |
|----------------|----------------|--------------------|-------------|
| React + Bootstrap | Flask + Flask-CORS | spaCy, scikit-learn | SQLite      |

---

## 📁 Project Structure

job-tracker-analyzer/
│
├── backend/
│ ├── app.py
│ ├── models.py
│ ├── resume_analyzer.py
│ ├── requirements.txt
│ └── resumes/ # Folder where resumes are stored
│
├── frontend/
│ └── (React App)
│
└── README.md


---

## ⚙️ Setup Instructions

### 🐍 Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # On Windows
pip install -r requirements.txt
python -m spacy download en_core_web_sm
flask run
```
The backend runs at: http://localhost:5000

### ⚛️ Frontend

```bash
cd frontend
npm install
npm start
```
The frontend runs at: http://localhost:3000