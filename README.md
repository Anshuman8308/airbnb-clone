# Airbnb Web App

A production-ready, full-stack web application designed to replicate the core workflows and aesthetic of Airbnb. Built from the ground up for a Software Development Engineer (SDE) assignment to demonstrate proficiency with modern React frameworks, RESTful APIs, and relational database design.

## Live Demo
- **Frontend App**: [https://anshuman-airbnb-clone.vercel.app](https://anshuman-airbnb-clone.vercel.app/)
- **Backend API**: [https://airbnb-backend-yjc8.onrender.com](https://airbnb-backend-yjc8.onrender.com)
- **API Documentation**: [https://airbnb-backend-yjc8.onrender.com/docs](https://airbnb-backend-yjc8.onrender.com/docs)
- **GitHub Repository**: [https://github.com/Anshuman8308/airbnb-clone](https://github.com/Anshuman8308/airbnb-clone)

---

## Assignment Requirement Coverage

Every major feature required by the assignment has been addressed. The table below maps assignment requirements to the actual implementation.

| Requirement | Implementation | Status |
| :--- | :--- | :---: |
| **Grid of listing cards** | Responsive CSS grid displaying title, location, price, rating, and photos. | ✅ |
| **Search bar** | Integrated pill-style search bar filtering by destination, dates, and guests. | ✅ |
| **Category/filter row** | Top categories (All, Homes, Experiences, Services) + modal for amenities/price. | ✅ |
| **Listing details** | Full page showing gallery, host info, description, calendar, and price summary. | ✅ |
| **Booking flow** | Sticky reservation widget, date validation, fee breakdown, and mock checkout. | ✅ |
| **No overlapping dates** | Backend strictly validates `start_date < end_date` & `end_date > start_date`. | ✅ |
| **Persistent bookings** | Saved to SQLite. Instantly appears in "My Trips" and blocks calendar dates. | ✅ |
| **Host Experience (CRUD)**| Host dashboard allowing creation, editing, and deletion of property listings. | ✅ |
| **Mocked Checkout** | Intentional mock checkout modal bypassing real payment gateways. | ✅ |
| **Tech Stack** | Next.js (TypeScript) + Python FastAPI + SQLite. | ✅ |
| **Seeded Database** | Pre-seeded with 16 global listings, hosts, reviews, and dynamic media. | ✅ |

---

## Features

### Search & Discovery
- **Rich Explore Grid**: Displays homes with image carousels, optimistic wishlist toggling, and formatted pricing.
- **Synchronized Search**: Combines text search (city/title/location), check-in/checkout dates, and precise guest steppers.
- **Top-Level Navigation**: Custom routes cleanly swapping views between **All**, **Homes**, **Experiences**, and **Services**.

### Listing Details & Booking
- **Masonry Galleries**: Prominent 5-photo mosaic with a lightbox "Show all photos" modal.
- **Interactive Calendar**: Validates date availability in real-time, blocking out previously reserved days.
- **Live Price Calculation**: Dynamically updates `(Nightly Rate × Nights) + Cleaning Fee + Service Fee`.

### Trips & Wishlists
- **My Trips**: Dedicated dashboard for guests to view upcoming/past reservations and cancel bookings.
- **Wishlists**: Persistent saved properties accessible via the navbar heart icon.

### Host Experience
- **Role Switching**: Instant toggling between demo Guest profile and demo Superhost profile.
- **Dashboard**: High-level metrics tracking total active listings, gross revenue, and incoming reservations.
- **Full CRUD**: Wizards for creating properties (with image upload/URL support), editing details, and deleting.

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Maps**: Leaflet / React-Leaflet (OpenStreetMap)
- **Backend API**: Python 3.13, FastAPI, Uvicorn
- **Database / ORM**: SQLite, SQLAlchemy, Pydantic
- **Deployment**: Vercel (Frontend) & Render (Backend)

---

## Architecture

The application uses a decoupled Client-Server architecture communicating via REST APIs:

**Browser (Client)**
↓ *(HTTP / JSON)*
**Next.js Frontend (Vercel)**: Manages UI state, routing, context providers, and Tailwind styling.
↓ *(REST API calls via native Fetch API)*
**FastAPI Backend (Render)**: Exposes modular routers, enforces business logic (e.g., date overlap prevention).
↓ *(SQLAlchemy ORM)*
**SQLite Database**: Persists Users, Listings, Images, Bookings, Reviews, and Wishlists.

### State & Context Management
Frontend global state is handled via React Context API (`AuthContext` for user sessions, `SearchContext` for global search parameters, and `WishlistContext` for optimistic UI updates).

---

## Project Structure

```text
frontend/
├── src/
│   ├── app/                  # Next.js App Router (page.tsx, layout.tsx, trips/, host/)
│   ├── components/           # Modular UI (layout/, listings/, map/, booking/)
│   ├── context/              # Global React Contexts (Auth, Search, Wishlists)
│   └── lib/                  # Helper utilities and API fetching wrappers
backend/
├── app/
│   ├── models/               # SQLAlchemy SQLite schema definitions
│   ├── routers/              # FastAPI endpoints (listings, bookings, reviews, host)
│   ├── schemas/              # Pydantic validation and serialization models
│   ├── database.py           # DB engine setup and seeding logic
│   └── main.py               # FastAPI application entry point
```

---

## Database Design

The relational database strictly enforces foreign key constraints and cascade deletions to prevent orphaned records.

- **USERS**: Stores both guests and hosts. Fields include `name`, `email`, `is_host`.
- **LISTINGS**: Core property data (`title`, `price_per_night`, `latitude`, `longitude`, `max_guests`, `amenities`). Related to `USERS` via `host_id`.
- **LISTING_IMAGES**: Maintains 1-to-many relationship with `LISTINGS` (`url`, `display_order`).
- **BOOKINGS**: Transactional table linked to `LISTINGS` and `USERS`. Stores `start_date`, `end_date`, `total_price`, `status`.
- **REVIEWS**: Associates a `user_id` and `listing_id` with a 1-5 rating across multiple categories (cleanliness, accuracy, etc.) and a text comment.
- **WISHLISTS**: Join table storing `user_id` and `listing_id` for saved properties.

**Relationship Flow:**
A `User` (Host) **owns** many `Listings`.
A `Listing` **receives** many `Bookings`, **has** many `ListingImages`, and **gets** many `Reviews`.
A `User` (Guest) **creates** many `Bookings` and **maintains** a `Wishlist`.

---

## API Overview

The backend exposes a highly modular, documented REST API.

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| **Listings** | | |
| GET | `/api/listings` | Fetches listings (supports search, filters, pagination). |
| GET | `/api/listings/{id}` | Fetches detail view, joining images, host, and reviews. |
| POST | `/api/listings` | Host action: creates a new property listing. |
| PUT | `/api/listings/{id}` | Host action: updates an existing listing. |
| DELETE| `/api/listings/{id}` | Host action: deletes listing (cascades bookings/images). |
| **Bookings** | | |
| POST | `/api/bookings` | Creates reservation with date-overlap validation. |
| GET | `/api/bookings/my` | Fetches active user's past and upcoming reservations. |
| GET | `/api/bookings/listing/{id}/booked-dates` | Returns unavailable date ranges for calendar blocking. |
| DELETE| `/api/bookings/{id}` | Cancels an existing booking. |
| **Reviews & Wishlists** | | |
| POST | `/api/reviews/listing/{id}` | Submits a guest review. |
| POST | `/api/wishlists/toggle` | Toggles property in the active user's wishlist. |
| **Host** | | |
| GET | `/api/host/dashboard` | Returns aggregated metrics (revenue, active listings) for host. |

---

## Key Workflows

### Search & Filtering Workflow
1. User adjusts parameters (location, dates, guests, property type) in the `SearchModal` or `FilterModal`.
2. `SearchContext` updates globally.
3. `useEffect` in `page.tsx` triggers a `GET /api/listings` call passing parameters as URL query arguments.
4. FastAPI backend queries SQLite, filtering via SQLAlchemy `ilike()` and mathematical boundary checks, returning a paginated JSON response.

### Booking & Date Validation Workflow
1. User selects dates on the `ReservationWidget` calendar (which visually blocks dates fetched from `/api/bookings/listing/{id}/booked-dates`).
2. User clicks "Reserve", opening the mock Checkout Modal.
3. Upon confirmation, `POST /api/bookings` fires.
4. **Backend Validation**: FastAPI explicitly checks: 
   `conflict = db.query(Booking).filter(start_date < new_end_date AND end_date > new_start_date)`
5. If no conflict exists, the booking writes to SQLite and redirects the user to `/trips`.

### Navigation & State Architecture
Clicking top-level categories (All, Homes, Experiences, Services) mutates the Next.js `searchParams`. React `useEffect` hooks cleanly clear out localized detail states (`selectedExp`, `selectedSrv`), ensuring users only ever see one product state at a time. The browser's History API (`pushState`) is integrated so the Back button safely closes detail views.

---

## Mocked / Simplified Components

To align with assignment bounds and facilitate rapid evaluation without third-party API keys:
- **Authentication**: Fully mocked via a seamless dropdown allowing the evaluator to swap between a pre-configured Guest and Host.
- **Payments**: The checkout workflow is a realistic UI simulation that commits the booking to the database without requiring actual credit card processing.
- **Map Rendering**: Uses open-source Leaflet with OpenStreetMap rather than a paid Google Maps/Mapbox integration.
- **Messaging**: The "Contact Host" feature is implemented purely as a UI placeholder.

---

## Deployment

**Frontend (Vercel)**
- Automatically deployed from the `/frontend` root.
- Environment Variable: `NEXT_PUBLIC_API_URL` pointing to the Render backend.

**Backend (Render)**
- Deployed as a web service from the `/backend` root.
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- SQLite is deployed ephemerally; data resets upon Render spins (acceptable for demo purposes).

---

## Local Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Clone the repository
```bash
git clone https://github.com/Anshuman8308/airbnb-clone.git
cd airbnb-clone
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Activate (Windows):
.\venv\Scripts\activate
# Activate (Mac/Linux):
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```
API runs on `http://127.0.0.1:8000`.

### 3. Frontend Setup
Open a new terminal tab:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`.

---

## Testing / Verification

To verify backend integrity, a comprehensive automated test suite covers the API layer.
```bash
cd backend
python test_backend.py
```
This script sequentially validates list retrieval, pagination, booking overlap prevention, review creation, and host metrics.

---

## Assumptions & Limitations

**Assumptions**:
- **Evaluation Priority**: Assumed the evaluator wants frictionless access. Therefore, rigid JWT authentication walls were bypassed in favor of instant mock-profile switching.
- **Images**: Local static images are used heavily for the fallback database seed to ensure the UI looks excellent without requiring a connected S3 bucket.

**Limitations**:
- Because Render's free tier uses an ephemeral filesystem, any listings or bookings created in the Live Demo may disappear if the Render server sleeps and restarts (which destroys the `airbnb.db` file). Running the project locally circumvents this completely.
- Map search (updating listings by dragging the map) is visually mocked but does not trigger bounding-box geospatial backend queries.

---

## Bonus Features

| Bonus Feature | Status | Details |
| :--- | :---: | :--- |
| **Interactive Map/Pins** | ✅ | Functional Leaflet map toggling with custom CSS price pins. |
| **Reviews & Aggregation**| ✅ | Seeded reviews properly aggregate into average location/value scores. |
| **Dark Mode** | ✅ | Native Tailwind dark mode toggle implemented in the navbar. |
| **Responsive Design** | ✅ | Mobile-first breakpoints implemented comprehensively across the grid. |

---


## Conclusion

This project successfully fulfills the SDE Fullstack Assignment requirements by delivering a highly interactive, component-driven frontend coupled with a robust, relational API backend. Every core workflow—from discovery and overlap-protected booking to host management—is fully operational.
