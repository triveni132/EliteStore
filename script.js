// Sample product data with real images
const products = [{
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    image: "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
    category: "Electronics"
}, {
    id: 2,
    name: "Smart Watch Pro",
    price: 399.99,
    description: "Advanced smartwatch with fitness tracking, heart rate monitor, and GPS.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
    category: "Electronics"
}, {
    id: 3,
    name: "Designer Backpack",
    price: 149.99,
    description: "Stylish and functional backpack perfect for work and travel.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
    category: "Fashion"
}, {
    id: 4,
    name: "Wireless Mouse",
    price: 79.99,
    description: "Ergonomic wireless mouse with precision tracking and long battery life.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop",
    category: "Electronics"
}, {
    id: 5,
    name: "Coffee Maker Deluxe",
    price: 199.99,
    description: "Professional coffee maker with multiple brewing options and programmable settings.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop",
    category: "Home"
}, {
    id: 6,
    name: "Fitness Tracker",
    price: 129.99,
    description: "Lightweight fitness tracker with step counting, sleep monitoring, and water resistance.",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=200&fit=crop",
    category: "Health"
}];

// Application state
let currentUser = null;
let cart = [];
let orders = [];
let isLogin = true;

// Touch-friendly interactions for mobile
function addTouchSupport() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Improved mobile navigation
function handleMobileNavigation() {
    const navButtons = document.querySelector('.nav-buttons');
    let startY = 0;
    let currentY = 0;
    let isScrolling = false;

    if (window.innerWidth <= 768) {
        navButtons.style.overflow = 'hidden';
    }
}

// Responsive cart display
function displayCart() {
    const container = document.getElementById('cartItems');
    const totalContainer = document.getElementById('cartTotal');

    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart"><h3>Your cart is empty</h3><p>Add some products to get started!</p></div>';
        totalContainer.style.display = 'none';
        return;
    }

    container.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        // Check if mobile view
        const isMobile = window.innerWidth <= 768;

        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div style="display: flex; align-items: center; gap: 1rem; ${isMobile ? 'flex-direction: column; text-align: center;' : ''}">
                    <div style="width: 60px; height: 60px; border-radius: 8px; overflow: hidden; flex-shrink: 0;">
                        <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div>
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} each</p>
                    </div>
                </div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span style="margin: 0 1rem; font-weight: bold;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div style="margin-left: 1rem; font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="btn btn-secondary" onclick="removeFromCart(${item.id})" style="margin-left: 1rem;">Remove</button>
            </div>
        `;

        container.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    document.getElementById('totalAmount').textContent = total.toFixed(2);
    totalContainer.style.display = 'block';
}

// Mobile-optimized product details
function showProductDetails(product) {
    const modal = document.getElementById('productModal');
    const details = document.getElementById('productDetails');

    const isMobile = window.innerWidth <= 480;
    const imageSize = isMobile ? '250px' : '300px';

    details.innerHTML = `
        <div style="text-align: center; color: white;">
            <div class="product-image-modal" style="margin: 0 auto 1rem; width: ${imageSize}; height: ${imageSize}; border-radius: 15px; overflow: hidden;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <h2 style="margin-bottom: 1rem; font-size: ${isMobile ? '1.3rem' : '1.5rem'};">${product.name}</h2>
            <p style="font-size: 1.5rem; color: #4ecdc4; font-weight: bold; margin-bottom: 1rem;">$${product.price.toFixed(2)}</p>
            <p style="margin-bottom: 2rem; line-height: 1.6; font-size: ${isMobile ? '0.9rem' : '1rem'};">${product.description}</p>
            <button class="btn btn-primary" onclick="addToCart(${product.id}); closeModal('productModal')" style="width: ${isMobile ? '100%' : 'auto'};">Add to Cart</button>
        </div>
    `;

    modal.style.display = 'block';
}

// Handle window resize
window.addEventListener('resize', function() {
    handleMobileNavigation();
    if (document.getElementById('cart').classList.contains('active')) {
        displayCart();
    }
});

// Initialize mobile support
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    displayProducts();
    updateCartUI();
    updateAuthUI();
    handleMobileNavigation();
    addTouchSupport();
});

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    if (pageId === 'products') {
        displayAllProducts();
    } else if (pageId === 'orders') {
        displayOrderHistory();
    } else if (pageId === 'home') {
        displayProducts();
    }
}

function showCart() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('cart').classList.add('active');
    displayCart();
}

// Product display functions
function displayProducts() {
    const container = document.getElementById('featuredProducts');
    container.innerHTML = '';

    products.slice(0, 3).forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function displayAllProducts() {
    const container = document.getElementById('allProducts');
    container.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => showProductDetails(product);

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 15px;">
        </div>
        <div class="product-info">
            <div class="product-title">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-description">${product.description}</div>
            <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})">Add to Cart</button>
        </div>
    `;

    return card;
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }

    updateCartUI();
    showNotification('Added to cart!');
    saveCartData();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    displayCart();
    saveCartData();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            displayCart();
            saveCartData();
        }
    }
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Checkout function
function checkout() {
    if (!currentUser) {
        showNotification('Please login to checkout');
        showAuth();
        return;
    }

    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }

    const order = {
        id: Date.now(),
        userId: currentUser.id,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'Processing'
    };

    orders.push(order);
    cart = [];

    updateCartUI();
    saveOrderData();
    saveCartData();

    showNotification('Order placed successfully!');
    showPage('orders');
}

// Order history
function displayOrderHistory() {
    const container = document.getElementById('orderHistory');

    if (!currentUser) {
        container.innerHTML = '<div class="empty-cart"><h3>Please login to view orders</h3></div>';
        return;
    }

    const userOrders = orders.filter(order => order.userId === currentUser.id);

    if (userOrders.length === 0) {
        container.innerHTML = '<div class="empty-cart"><h3>No orders yet</h3><p>Place your first order to see it here!</p></div>';
        return;
    }

    container.innerHTML = '';

    userOrders.reverse().forEach(order => {
                const orderElement = document.createElement('div');
                orderElement.className = 'order-item';

                const orderDate = new Date(order.date).toLocaleDateString();
                const isMobile = window.innerWidth <= 768;

                orderElement.innerHTML = `
            <div class="order-header" style="${isMobile ? 'flex-direction: column; gap: 0.5rem;' : ''}">
                <div class="order-id">Order #${order.id}</div>
                <div class="order-date">${orderDate}</div>
            </div>
            <div>
                ${order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; ${isMobile ? 'flex-direction: column; text-align: center; gap: 0.25rem;' : ''}">
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">Total: $${order.total.toFixed(2)}</div>
        `;
        
        container.appendChild(orderElement);
    });
}

// Auth functions
function showAuth() {
    document.getElementById('authModal').style.display = 'block';
}

function toggleAuth() {
    isLogin = !isLogin;
    const title = document.getElementById('authTitle');
    const submit = document.getElementById('authSubmit');
    const toggleText = document.getElementById('authToggleText');
    const toggleLink = document.getElementById('authToggleLink');
    const nameGroup = document.getElementById('nameGroup');
    
    if (isLogin) {
        title.textContent = 'Login';
        submit.textContent = 'Login';
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = 'Sign Up';
        nameGroup.style.display = 'none';
    } else {
        title.textContent = 'Sign Up';
        submit.textContent = 'Sign Up';
        toggleText.textContent = 'Already have an account?';
        toggleLink.textContent = 'Login';
        nameGroup.style.display = 'block';
    }
}

function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const ordersBtn = document.getElementById('ordersBtn');
    
    if (currentUser) {
        authBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-flex';
        ordersBtn.style.display = 'inline-flex';
        logoutBtn.textContent = currentUser.name || currentUser.email;
    } else {
        authBtn.style.display = 'inline-flex';
        logoutBtn.style.display = 'none';
        ordersBtn.style.display = 'none';
    }
}

function logout() {
    currentUser = null;
    cart = [];
    updateAuthUI();
    updateCartUI();
    showNotification('Logged out successfully');
    showPage('home');
    saveUserData();
    saveCartData();
}

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Notification function
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Data persistence (simulating backend)
function saveUserData() {
    // Using in-memory storage instead of localStorage for artifact compatibility
    window.userData = {
        currentUser: currentUser,
        users: users
    };
}

function saveCartData() {
    // Using in-memory storage instead of localStorage for artifact compatibility
    window.cartData = cart;
}

function saveOrderData() {
    // Using in-memory storage instead of localStorage for artifact compatibility
    window.orderData = orders;
}

function loadUserData() {
    // Using in-memory storage instead of localStorage for artifact compatibility
    if (window.userData) {
        currentUser = window.userData.currentUser;
        users = window.userData.users || [];
    }
    if (window.cartData) {
        cart = window.cartData;
    }
    if (window.orderData) {
        orders = window.orderData;
    }
}

// User management
let users = [];

document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    
    if (isLogin) {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            showNotification('Login successful!');
            closeModal('authModal');
            updateAuthUI();
            saveUserData();
        } else {
            showNotification('Invalid credentials');
        }
    } else {
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            showNotification('User already exists');
        } else {
            const newUser = {
                id: Date.now(),
                email: email,
                password: password,
                name: name || email.split('@')[0]
            };
            users.push(newUser);
            currentUser = newUser;
            showNotification('Registration successful!');
            closeModal('authModal');
            updateAuthUI();
            saveUserData();
        }
    }
    
    document.getElementById('authForm').reset();
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const authModal = document.getElementById('authModal');
    const productModal = document.getElementById('productModal');
    
    if (event.target === authModal) {
        closeModal('authModal');
    }
    if (event.target === productModal) {
        closeModal('productModal');
    }
});

// Prevent zoom on double tap (mobile)
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

let lastTouchEnd = 0;