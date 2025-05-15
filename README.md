# AI-Powered Health Metrics Tracker

A full-stack personal health visualization app that tracks **Steps**, **Sleep Hours**, and **Heart Rate** across the entire year.

Users can submit their daily data, set personal goals, and view dynamic heatmaps where each day is color-coded based on performance relative to those goals.

---

## ✨ Features

- Full-year calendar view with a square for every day
- Color-coded health metrics based on goal achievement (Red → Yellow → Green)
- Dynamic goal setting (preset suggestions + custom typing)
- Floating tooltips showing date and value on hover
- Smooth hover animation scaling for better UX
- Randomized data generator for easy testing
- Organized, scalable codebase

---

## 🛠 Tech Stack

- **Frontend**: React 18
- **Backend**: FastAPI (Python 3.9+)
- **Database**: SQLite
- **Styling**: Pure CSS Flexbox + Inline styles
- **Local Hosting**: 
  - Backend on `localhost:8000`
  - Frontend on `localhost:3000`

---

## ⚡ Quick Setup Instructions

### 1. Requirements

Make sure you have installed:
- **Python** (version 3.9 or later) → [Download Python](https://www.python.org/downloads/)
- **Node.js + npm** → [Download Node.js](https://nodejs.org/)

Check versions:

```bash
python --version
node --version
npm --version
2. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/health-metrics-tracker.git
cd health-metrics-tracker
3. Set Up the Backend (FastAPI)
Move into the backend folder:

bash
Copy
Edit
cd health-metric-tracker-backend
✅ Create a virtual environment:

bash
Copy
Edit
python -m venv venv
✅ Activate the virtual environment:

On Windows:

bash
Copy
Edit
venv\Scripts\activate
On Mac/Linux:

bash
Copy
Edit
source venv/bin/activate
✅ Install required Python packages:

bash
Copy
Edit
pip install fastapi uvicorn
✅ Start the backend server:

bash
Copy
Edit
uvicorn main:app --reload
Backend will be available at:
👉 http://localhost:8000

4. Set Up the Frontend (React)
Open a new terminal window (keep the backend running!).

Move into the frontend folder:

bash
Copy
Edit
cd frontend
✅ Install frontend dependencies:

bash
Copy
Edit
npm install
✅ Start the frontend React app:

bash
Copy
Edit
npm start
Frontend will open automatically at:
👉 http://localhost:3000