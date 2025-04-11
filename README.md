# EDDIES Shop

A modern e-commerce platform built with Flask and Tailwind CSS.

## Project Structure
```
eddies-shop/
├── app.py                 # Main Flask application
├── products.py           # Product data
├── static/
│   ├── css/
│   │   └── style.css    # Custom CSS styles
│   ├── js/
│   │   └── main.js      # Frontend JavaScript
│   └── uploads/         # Product image uploads
└── templates/
    ├── index.html       # Home page template
    └── category.html    # Category page template
```

## Requirements
- Python 3.x
- Flask
- Werkzeug

## Setup Instructions

1. Clone or download the project files
2. Create a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install required packages:
   ```bash
   pip install flask werkzeug
   ```
4. Run the application:
   ```bash
   python app.py
   ```
5. Access the website at `http://localhost:5000`

## Features

- **Product Catalog**: Browse products by categories (games, electronics, fashion, beauty)
- **Shopping Cart**: Add/remove items, view total, animated cart interactions
- **User Authentication**: Registration and login functionality (frontend only)
- **Product Upload**: Sell items with image upload capability
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Modern UI**: Animated backgrounds, glowing effects, and smooth transitions

## Frontend Dependencies (CDN)

- Tailwind CSS
- Font Awesome
- Google Fonts (Poppins)

## Development Notes

- The project uses CDN links for Tailwind CSS and Font Awesome
- Product images are stored in `static/uploads/`
- Sample product data is stored in `products.py`
- The application runs in debug mode by default

## Browser Support

The application uses modern CSS features like:
- CSS Grid
- Flexbox
- CSS animations
- Backdrop filters

Ensure you're using a modern browser for the best experience.
