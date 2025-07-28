// Global variables
let cartItems = [];
let itemToRemove = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 800);

    // Load and display cart
    loadCart();
    displayCart();
    updateCartCount();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Add animations
    initializeAnimations();
});

// Load cart from localStorage
function loadCart() {
    cartItems = JSON.parse(localStorage.getItem('cart')) || [];
}

// Display cart items
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCart = document.getElementById('empty-cart');

    cartContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartSummary.style.display = 'none';
        emptyCart.style.display = 'block';
        emptyCart.classList.add('animate-fadeIn');
        return;
    }

    emptyCart.style.display = 'none';
    cartSummary.style.display = 'block';

    cartItems.forEach((item, index) => {
        const cartItemElement = createCartItemElement(item, index);
        cartContainer.appendChild(cartItemElement);
    });

    updateCartSummary();
    
    // Add stagger animation to cart items
    const items = cartContainer.querySelectorAll('.cart-item');
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('animate-slideIn');
    });
}

// Create cart item element
function createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <div class="cart-item-header">
            <div class="cart-item-info">
                <h2>${item.title}</h2>
                <div class="cart-item-meta">
                    <div class="cart-meta-item">
                        <span>📅</span>
                        <span>${item.date}</span>
                    </div>
                    <div class="cart-meta-item">
                        <span>📍</span>
                        <span>${item.venue}</span>
                    </div>
                    <div class="cart-meta-item">
                        <span>🎫</span>
                        <span>${item.quantity} Ticket${item.quantity > 1 ? 's' : ''}</span>
                    </div>
                    <div class="cart-meta-item">
                        <span>💰</span>
                        <span>₹${item.price.toLocaleString()} each</span>
                    </div>
                </div>
            </div>
            <div class="cart-item-total">
                ₹${item.totalPrice.toLocaleString()}
            </div>
        </div>
        <div class="cart-actions">
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <button class="btn btn-danger" onclick="confirmRemoveFromCart(${index})">
                <span>🗑️</span>
                <span>Remove</span>
            </button>
        </div>
    `;
    return cartItem;
}

// Update item quantity
function updateQuantity(index, change) {
    if (index >= 0 && index < cartItems.length) {
        const newQuantity = cartItems[index].quantity + change;
        
        if (newQuantity <= 0) {
            confirmRemoveFromCart(index);
            return;
        }
        
        if (newQuantity > 10) {
            showToast('Maximum 10 tickets allowed per event', 'warning');
            return;
        }
        
        cartItems[index].quantity = newQuantity;
        cartItems[index].totalPrice = cartItems[index].price * newQuantity;
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        // Refresh display
        displayCart();
        updateCartCount();
        
        showToast('Quantity updated!', 'success');
    }
}

// Confirm remove item from cart
function confirmRemoveFromCart(index) {
    itemToRemove = index;
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'flex';
    modal.classList.add('animate-fadeIn');
    
    document.getElementById('confirmRemove').onclick = function() {
        removeFromCart(itemToRemove);
        closeModal();
    };
}

// Remove item from cart
function removeFromCart(index) {
    if (index >= 0 && index < cartItems.length) {
        const removedItem = cartItems[index];
        cartItems.splice(index, 1);
        
        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        // Refresh display
        displayCart();
        updateCartCount();
        
        showToast(`${removedItem.title} removed from cart`, 'success');
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'none';
    itemToRemove = null;
}

// Update cart summary
function updateCartSummary() {
    const totalItems = cartItems.length;
    const totalTickets = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const grandTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-tickets').textContent = totalTickets;
    document.getElementById('grand-total').textContent = grandTotal.toLocaleString();
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cartItems.length;
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cartItems.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    // Animate button
    const button = event.target.closest('button');
    const originalContent = button.innerHTML;
    
    button.innerHTML = '<span class="spinner"></span> Processing...';
    button.disabled = true;
    
    setTimeout(() => {
        // Simulate payment processing
        showToast('Redirecting to payment gateway...', 'info');
        
        setTimeout(() => {
            // For demo purposes, show success message
            showToast('Payment feature coming soon! Thank you for your interest.', 'success');
            button.innerHTML = originalContent;
            button.disabled = false;
        }, 2000);
    }, 1500);
}

// Initialize scroll effects
function initializeScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header hide/show on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Initialize animations
function initializeAnimations() {
    // Animate summary cards
    const summaryElements = document.querySelectorAll('.cart-summary, .empty-cart');
    summaryElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.getElementById('nav');
    nav.classList.toggle('active');
}

// Toast notification system
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✅' : 
                 type === 'error' ? '❌' : 
                 type === 'warning' ? '⚠️' : 'ℹ️';
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC key to close modal or mobile menu
    if (e.key === 'Escape') {
        closeModal();
        const nav = document.getElementById('nav');
        nav.classList.remove('active');
    }
    
    // Enter key to proceed to checkout
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        proceedToCheckout();
    }
});

// Add loading states to buttons
document.querySelectorAll('.btn').forEach(btn => {
    if (!btn.onclick && !btn.getAttribute('onclick')) {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('loading') && !this.disabled) {
                this.classList.add('loading');
                const originalText = this.innerHTML;
                this.innerHTML = '<span class="spinner"></span> Loading...';
                
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.innerHTML = originalText;
                }, 800);
            }
        });
    }
});

// Auto-save cart changes
function autoSaveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Clear entire cart
function clearCart() {
    if (cartItems.length === 0) {
        showToast('Cart is already empty!', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear your entire cart?')) {
        cartItems = [];
        localStorage.setItem('cart', JSON.stringify(cartItems));
        displayCart();
        updateCartCount();
        showToast('Cart cleared successfully!', 'success');
    }
}

// Add clear cart button functionality if needed
const clearCartBtn = document.getElementById('clear-cart');
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
}

// Handle page visibility change to sync cart
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        loadCart();
        displayCart();
        updateCartCount();
    }
});

// Add modal styles dynamically
const modalStyles = `
<style>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    backdrop-filter: blur(5px);
}

.modal-content {
    background: var(--white);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-xl);
    max-width: 400px;
    width: 90%;
    text-align: center;
    animation: slideUp 0.3s ease;
}

.modal-content h3 {
    margin-bottom: 1rem;
    color: var(--gray-800);
}

.modal-content p {
    margin-bottom: 2rem;
    color: var(--gray-600);
}

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.modal-actions .btn {
    min-width: 100px;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.summary-details {
    margin: 1.5rem 0;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--gray-200);
}

.summary-row.total-row {
    border-bottom: 2px solid var(--primary-color);
    font-weight: 700;
    font-size: 1.1rem;
    margin-top: 1rem;
    padding-top: 1rem;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', modalStyles);