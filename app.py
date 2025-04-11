from flask import Flask, render_template, request, jsonify, url_for, redirect, send_from_directory
from products import sample_products
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return render_template('index.html', products=sample_products)

@app.route('/category/<category>')
def category_page(category):
    print(f"Accessing category: {category}")  # Debug log
    filtered_products = [p for p in sample_products if p['category'].lower() == category.lower()]
    print(f"Filtered products ({len(filtered_products)} found): {filtered_products}")  # Debug log
    
    # Ensure all required fields are present
    for product in filtered_products:
        product.setdefault('id', 0)
        product.setdefault('name', '')
        product.setdefault('category', '')
        product.setdefault('price', 0.0)
        product.setdefault('description', '')
        product.setdefault('image', '')
    
    return render_template('category.html', category=category, products=filtered_products)

@app.route('/api/products/<category>')
def get_products_by_category(category):
    if category == 'all':
        return jsonify(sample_products)
    filtered_products = [p for p in sample_products if p['category'] == category]
    print(f"Filtered products for {category}: {filtered_products}")  # Debug log
    return jsonify(filtered_products)


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    # Here you would typically:
    # 1. Validate the data
    # 2. Hash the password
    # 3. Store in database
    # 4. Send verification email/SMS
    return jsonify({'success': True, 'message': 'Registration successful'})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    # Here you would typically:
    # 1. Verify credentials
    # 2. Create session
    return jsonify({'success': True, 'message': 'Login successful'})

@app.route('/upload-product', methods=['POST'])
def upload_product():
    if 'image' not in request.files:
        return jsonify({'success': False, 'message': 'No image uploaded'})
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No image selected'})
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Here you would typically:
        # 1. Save product details to database
        # 2. Process the image (resize, optimize, etc.)
        
        # For now, we'll add it to our sample products
        new_product = {
            'id': len(sample_products) + 1,
            'name': request.form.get('name'),
            'category': request.form.get('category'),
            'price': float(request.form.get('price')),
            'description': request.form.get('description'),
            'image': url_for('static', filename=f'uploads/{filename}')
        }
        sample_products.append(new_product)
        
        return jsonify({
            'success': True,
            'message': 'Product uploaded successfully',
            'product': new_product
        })
    
    return jsonify({'success': False, 'message': 'Invalid file type'})

if __name__ == '__main__':
    app.run(debug=True)
