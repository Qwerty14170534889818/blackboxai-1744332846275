// Country codes for phone number selection
const countryCodes = {
    "US": "+1",
    "UK": "+44",
    "CA": "+1",
    "AU": "+61",
    "IN": "+91",
    // Add more country codes as needed
};

// Cart functionality
class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        // Initialize cart icon click handler
        const cartIcon = document.getElementById('cart-icon');
        const cartSidebar = document.getElementById('cart-sidebar');
        
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                cartSidebar.classList.toggle('translate-x-full');
            });
        }

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
                cartSidebar.classList.add('translate-x-full');
            }
        });
    }

    addItem(product) {
        this.items.push(product);
        this.calculateTotal();
        this.updateCartUI();
        this.showCartAnimation();
        
        // Show the cart sidebar
        const cartSidebar = document.getElementById('cart-sidebar');
        cartSidebar.classList.remove('translate-x-full');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.calculateTotal();
        this.updateCartUI();
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + item.price, 0);
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const cartItems = document.getElementById('cart-items');

        if (cartCount) cartCount.textContent = this.items.length;
        if (cartTotal) cartTotal.textContent = `$${this.total.toFixed(2)}`;
        
        if (cartItems) {
            cartItems.innerHTML = this.items.map(item => `
                <div class="flex items-center justify-between p-2 border-b">
                    <div class="flex items-center">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                        <div class="ml-4">
                            <h4 class="font-bold">${item.name}</h4>
                            <p class="text-sm">$${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <button onclick="cart.removeItem(${item.id})" class="text-red-500">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    showCartAnimation() {
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('cart-bounce');
            setTimeout(() => cartIcon.classList.remove('cart-bounce'), 500);
        }
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Category filtering
function filterProducts(category) {
    fetch(`/api/products/${category}`)
        .then(response => response.json())
        .then(products => {
            const productsGrid = document.getElementById('products-grid');
            productsGrid.innerHTML = products.map(product => `
                <div class="product-card bg-white/20 backdrop-blur-md p-6 rounded-lg text-white" data-category="${product.category}">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-lg mb-4">
                    <h3 class="text-xl font-bold">${product.name}</h3>
                    <p class="text-gray-200 mt-2">${product.description}</p>
                    <p class="text-2xl font-bold mt-4">$${product.price.toFixed(2)}</p>
                    <button data-product='${JSON.stringify(product)}'
                            onclick="cart.addItem(JSON.parse(this.dataset.product))"
                            class="glow-button bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 w-full transition-all duration-300">
                        Add to Cart
                    </button>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone number validation with country code
function validatePhone(phone, countryCode) {
    const phoneRegex = {
        "+1": /^\+1\d{10}$/, // US/CA
        "+44": /^\+44\d{10}$/, // UK
        "+61": /^\+61\d{9}$/, // AU
        "+91": /^\+91\d{10}$/, // IN
    };
    return phoneRegex[countryCode]?.test(phone) || false;
}

// User registration
async function registerUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const email = formData.get('email');
    const phone = formData.get('phone');
    const countryCode = formData.get('countryCode');
    
    if (email && !validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    if (phone && !validatePhone(`${countryCode}${phone}`, countryCode)) {
        alert('Please enter a valid phone number');
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Registration successful! Please verify your email/phone.');
            document.getElementById('register-modal').classList.add('hidden');
        } else {
            alert(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        alert('Registration failed. Please try again.');
    }
}

// Product upload functionality
async function uploadProduct(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch('/upload-product', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Product listed successfully!');
            document.getElementById('sell-modal').classList.add('hidden');
            // Refresh the page to show the new product
            window.location.reload();
        } else {
            alert(data.message || 'Failed to list product. Please try again.');
        }
    } catch (error) {
        console.error('Error uploading product:', error);
        alert('Failed to list product. Please try again.');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Populate country codes dropdown
    const countryCodeSelect = document.getElementById('country-code');
    if (countryCodeSelect) {
        Object.entries(countryCodes).forEach(([country, code]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = `${country} (${code})`;
            countryCodeSelect.appendChild(option);
        });
    }
});
            
