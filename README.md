# IIIT Buy-Sell Platform

A full-stack web application for buying and selling items within the IIIT community. Built with React (frontend) and Node.js/Express/MongoDB (backend).

## Features

- **User Authentication:** Register and login with IIIT email verification and Google reCAPTCHA.
- **Browse & Search Items:** View all available items, filter by category, and search by name or description.
- **Sell Items:** List your own items for sale with details and images.
- **Cart & Checkout:** Add items to your cart and place orders with OTP-based delivery verification.
- **Order History:** View your pending, bought, and sold orders.
- **Deliver Items:** Sellers can verify OTPs to complete deliveries.
- **Support Chatbot:** Get help from an AI-powered assistant about using the platform.

## Tech Stack

- **Frontend:** React, React Router, React Bootstrap, Axios, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Other:** Google reCAPTCHA, Google Gemini AI (support bot), CryptoJS (OTP encryption)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB database (Atlas or local)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd code
   ```

2. **Backend Setup:**
   ```sh
   cd backend
   npm install
   # Configure .env with your MongoDB URI and API keys (see .env.example)
   npm run server
   ```

3. **Frontend Setup:**
   ```sh
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8000](http://localhost:8000)

## Folder Structure

```
code/
  backend/
    controllers/
    models/
    routes/
    ...
  frontend/
    src/
      pages/
      components/
      context/
      ...
```

## Environment Variables

See [`backend/.env`](backend/.env) for required variables:
- `PORT`
- `MONGO_URL`
- `jwtSecret`
- `CRYPTO_SECRET_KEY`
- `GEMINI_API_KEY`

## Usage

- Register with your IIIT email.
- Browse, search, and list items.
- Add items to your cart and checkout.
- Use the support chatbot for help.
