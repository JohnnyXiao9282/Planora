# TemplateHub

A digital template marketplace built with Flask. Users can browse, purchase, and download productivity and career templates. Features authentication, product catalog, cart, checkout, Stripe payment integration (placeholder), order history, admin management, and a modern responsive UI.

## Features
- User signup/login
- Product listing & detail pages
- Categories/filtering
- Shopping cart & checkout
- Stripe payment integration (placeholder)
- Order history
- Downloadable files after purchase
- Admin area for managing templates
- SQLite database
- Clean, modern, responsive UI

## Getting Started
1. Install dependencies: `pip install -r requirements.txt`
2. Run the app: `flask run`

## Project Structure
- `app/` - Main application package
- `app/templates/` - Jinja2 HTML templates
- `app/static/` - Static files (CSS, JS, images)
- `app/models/` - Database models
- `app/auth/` - Authentication blueprint
- `app/products/` - Product/catalog blueprint
- `app/cart/` - Cart/checkout blueprint
- `app/orders/` - Order history/downloads blueprint
- `app/admin/` - Admin management blueprint

## License
MIT
