# Modern Airbnb Clone

A beautiful, full-stack web application designed to replicate the core experience of Airbnb. Built from the ground up to showcase a modern, responsive user interface with seamless navigation between Stays, Experiences, and Services.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Maps**: Leaflet (OpenStreetMap)

### Backend
- **Framework**: FastAPI (Python 3.13)
- **Database**: SQLite
- **ORM**: SQLAlchemy
- **Validation**: Pydantic

---

## ✨ Features

- **Rich Discovery Experience**: Browse through seamlessly categorized Stays, Experiences, and Services, just like the real Airbnb.
- **Dynamic Search & Filters**: Search destinations, select dates, and adjust guest counts with a highly interactive, animated search bar.
- **Immersive Detail Views**: Full-page, high-quality detail views for Homes, Experiences, and Services featuring responsive masonry galleries and sticky reservation widgets.
- **Map Integration**: Toggle between listing grids and interactive Leaflet maps with custom pricing pins.
- **Booking Engine**: Robust reservation system with date-overlap validation to ensure no double bookings.
- **Host Dashboard**: Fully functional host tools to manage listings, track active bookings, and calculate revenue.
- **Instant Role Switching**: Toggle easily between Guest and Superhost profiles without friction.
- **Dark Mode Support**: Seamless transition between light and dark themes.

---

## 💻 Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
python -m venv venv

# Activate the virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn app.main:app --reload
```
The FastAPI server will start on `http://127.0.0.1:8000`.

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The Next.js frontend will be available at `http://localhost:3000`.

---

## 🏗️ Project Structure

The repository is organized into two primary applications:

- **`/frontend`**: The Next.js application containing all React components, contexts, and API integrations. The `src/app` directory handles the routing.
- **`/backend`**: The FastAPI application serving RESTful endpoints. The `app/routers` directory contains the modular route definitions.

---

## 📜 License

This project is for educational and portfolio purposes. Feel free to explore the code, test the functionality, and fork the repository for your own learning!
