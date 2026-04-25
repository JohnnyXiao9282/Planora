# Planora: TemplateHub



Planora is a full-stack web application for a digital template marketplace. Users can browse, purchase, and download resume templates. The project uses a Flask backend and a React TypeScript frontend.A digital template marketplace built with Flask. Users can browse, purchase, and download productivity and career templates. Features authentication, product catalog, cart, checkout, Stripe payment integration (placeholder), order history, admin management, and a modern responsive UI.



## Backend- Features

- **Framework:** Flask (Python)- User signup/login

- **Structure:** 2-layer (controller/routes + repository)- Product listing & detail pages

- **Model:** ResumeTemplate (id, name, description, file_path, preview_image)- Categories/filtering

- **API:** RESTful endpoints for CRUD operations on resume templates- Shopping cart & checkout

- **Location:** `/backend`- Stripe payment integration (placeholder)

- Order history

## Frontend- Downloadable files after purchase

- **Framework:** React (TypeScript)- Admin area for managing templates

- **Location:** `/frontend`- SQLite database

- **Setup:** Bootstrapped with Create React App (TypeScript template)- Clean, modern, responsive UI



## Getting Started## Getting Started

1. Install dependencies: `pip install -r requirements.txt`

### Backend2. Run the app: `flask run`

1. Install Python dependencies:

   ```bash## Project Structure

   pip install flask flask_sqlalchemy- `app/` - Main application package

   ```- `app/templates/` - Jinja2 HTML templates

2. Set up your database and environment variables as needed.- `app/static/` - Static files (CSS, JS, images)

3. Run the Flask app:- `app/models/` - Database models

   ```bash- `app/auth/` - Authentication blueprint

   flask run- `app/products/` - Product/catalog blueprint

   ```- `app/cart/` - Cart/checkout blueprint

- `app/orders/` - Order history/downloads blueprint

### Frontend- `app/admin/` - Admin management blueprint

1. Install Node.js dependencies:

   ```bash## License

   cd frontendMIT

   npm install
   ```
2. Start the React development server:
   ```bash
   npm start
   ```

## Project Structure
```
Planora/
├── backend/
│   ├── controller/
│   ├── model/
│   └── repo/
├── frontend/
│   ├── src/
│   └── public/
└── README.md
```

## License
MIT
