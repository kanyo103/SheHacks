# Mukuru SheHacks CPT 14 – Loyalty Rewards Web App

## 📌 Overview
A modern, Flask-based loyalty rewards web application for Mukuru customers. This prototype allows users to send money, earn and redeem loyalty points, and track their transaction history in a simple, engaging interface. The app uses in-memory storage (no database yet) and features a responsive, animated UI.

---

## ✨ Features
- Customer login and session management
- Send money and earn loyalty points (1 point per R100 sent)
- Tiered rewards system: Bronze, Silver, Gold
- Redeem points for rewards (airtime, groceries, fuel, etc.)
- View transaction history and points balance
- Modern, responsive UI with animations
- Sample data for demo/testing

---

## 👥 Team Members
- Karabo Lelaka
- Thulisile Vilakazi
- Stacey Van Wyk
- Thando Tshabalala

---
## System Structure

└── shehacksmukurunew
    ├── app.py
    ├── attached_assets
    ├── main.py
    ├── makuru
    ├── models.py
    ├── __pycache__
    ├── pyproject.toml
    ├── README.md
    ├── replit.md
    ├── routes.py
    ├── static
    ├── templates
    ├── tests
    └── uv.lock
    
## 🏗 System Architecture


### Frontend
- Jinja2 templates (HTML)
- Bootstrap 5 for layout and styling
- Custom CSS (Mukuru brand colors)
- Vanilla JS for UI interactions and animations

### Backend
- Flask (Python web framework)
- Flask-CORS for API security
- Session-based authentication
- Organized routes with Blueprints (`routes.py`)
- Logging for debugging

### Data Layer
- In-memory storage (Python classes/dicts)
- Models: Customers, Transactions, Rewards, Redemptions
- Pre-loaded with sample users and rewards
- Data resets on server restart

---

## 📦 Dependencies
- Flask
- Flask-CORS
- Bootstrap 5 (CDN)
- Font Awesome (CDN)
- Animate.css (CDN)
- Python stdlib: datetime, uuid, os, logging

All Python dependencies are managed in `pyproject.toml`.

---

## 🚀 Running the Project

### 1️⃣ Clone the repository
```sh
git clone <your-repo-url>
cd shehacks
```

### 2️⃣ Set up a virtual environment (recommended)
```sh
python3 -m venv venv
source venv/bin/activate
```

### 3️⃣ Install dependencies
```sh
pip install -e .
```
Or, if pip fails, install from `pyproject.toml` manually:
```sh
pip install flask flask-cors
```

### 4️⃣ Set environment variables (optional for dev)
```sh
export SESSION_SECRET=your_secret_key_here
export FLASK_ENV=development
```

### 5️⃣ Run the app
```sh
python app.py
```
Or
```sh
python main.py
```

The app will be available at http://localhost:5000

---

## ⚠️ Notes
- All data is in-memory and resets on server restart.
- For production, integrate a persistent database (e.g., SQLite, PostgreSQL).
- Demo password for all users: `demo123`

---

## 📁 Project Structure
- `app.py` – Flask app entry point
- `main.py` – Alternate entry point
- `models.py` – In-memory data models
- `routes.py` – All Flask routes and API endpoints
- `templates/` – Jinja2 HTML templates
- `static/` – CSS, JS, and assets
- `pyproject.toml` – Python dependencies

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License
This project is for educational and demo purposes only.
