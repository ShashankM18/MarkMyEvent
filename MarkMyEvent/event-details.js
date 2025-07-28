// Global variables
let currentQuantity = 1;
let basePrice = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 800);

    // Update cart count
    updateCartCount();
    
    // Initialize quantity controls
    initializeQuantityControls();
    
    // Add scroll effects
    initializeScrollEffects();
    
    // Initialize animations
    initializeAnimations();
    
    // Get base price from the page
    const priceElement = document.getElementById('event-price');
    if (priceElement) {
        basePrice = parseInt(priceElement.textContent);
        updateTotalPrice();
    }
});

// Initialize quantity controls
function initializeQuantityControls() {
    updateQuantityDisplay();
    updateTotalPrice();
}

// Increase quantity
function increaseQuantity() {
    if (currentQuantity < 10) {
        currentQuantity++;
        updateQuantityDisplay();
        updateTotalPrice();
        animateQuantityChange();
    } else {
        showToast('Maximum 10 tickets allowed per booking', 'warning');
    }
}

// Decrease quantity
function decreaseQuantity() {
    if (currentQuantity > 1) {
        currentQuantity--;
        updateQuantityDisplay();
        updateTotalPrice();
        animateQuantityChange();
    } else {
        showToast('Minimum 1 ticket required', 'warning');
    }
}

// Update quantity display
function updateQuantityDisplay() {
    const quantityDisplay = document.getElementById('quantity-display');
    if (quantityDisplay) {
        quantityDisplay.textContent = currentQuantity;
    }
}

// Update total price
function updateTotalPrice() {
    const totalPrice = basePrice * currentQuantity;
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = totalPrice.toLocaleString();
    }
}

// Animate quantity change
function animateQuantityChange() {
    const quantityDisplay = document.getElementById('quantity-display');
    const totalPriceElement = document.getElementById('total-price');
    
    if (quantityDisplay) {
        quantityDisplay.classList.add('animate-bounce');
        setTimeout(() => {
            quantityDisplay.classList.remove('animate-bounce');
        }, 600);
    }
    
    if (totalPriceElement) {
        totalPriceElement.classList.add('animate-bounce');
        setTimeout(() => {
            totalPriceElement.classList.remove('animate-bounce');
        }, 600);
    }
}

// Add to cart function
function addToCart() {
    const event = {
        id: Date.now(), // Unique ID for each cart item
        title: document.getElementById('event-title').textContent,
        date: document.getElementById('event-date').textContent,
        venue: document.getElementById('event-venue').textContent,
        price: basePrice,
        quantity: currentQuantity,
        totalPrice: basePrice * currentQuantity,
        image: document.querySelector('.event-details img').src
    };

    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if same event already exists in cart
    const existingEventIndex = cart.findIndex(item => 
        item.title === event.title && item.date === event.date
    );
    
    if (existingEventIndex !== -1) {
        // Update existing item
        cart[existingEventIndex].quantity += currentQuantity;
        cart[existingEventIndex].totalPrice = cart[existingEventIndex].price * cart[existingEventIndex].quantity;
        showToast(`Updated ${event.title} quantity in cart!`, 'success');
    } else {
        // Add new item
        cart.push(event);
        showToast(`${event.title} added to cart!`, 'success');
    }

    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count with animation
    updateCartCount();
    
    // Add button animation
    animateAddToCart();
}

// Animate add to cart button
function animateAddToCart() {
    const button = document.getElementById('add-to-cart');
    const originalContent = button.innerHTML;
    
    button.innerHTML = '<span class="spinner"></span> Adding...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = '<span>✅</span> <span>Added!</span>';
        
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.disabled = false;
        }, 1500);
    }, 1000);
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
        
        // Add bounce animation when count changes
        if (cart.length > 0) {
            cartCount.classList.add('animate-bounce');
            setTimeout(() => {
                cartCount.classList.remove('animate-bounce');
            }, 1000);
        }
    }
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
    // Animate meta cards on load
    const metaCards = document.querySelectorAll('.meta-card');
    metaCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-slideInUp');
    });
    
    // Animate content sections
    const sections = document.querySelectorAll('.event-description, .quantity-selector, .event-actions');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${(index + 1) * 0.2}s`;
        section.classList.add('animate-slideInUp');
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
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const nav = document.getElementById('nav');
        nav.classList.remove('active');
    }
    
    // Plus key to increase quantity
    if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        increaseQuantity();
    }
    
    // Minus key to decrease quantity
    if (e.key === '-') {
        e.preventDefault();
        decreaseQuantity();
    }
    
    // Enter key to add to cart
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        addToCart();
    }
});

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states to buttons
document.querySelectorAll('.btn').forEach(btn => {
    if (btn.id !== 'add-to-cart') { // Skip add-to-cart as it has custom animation
        btn.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
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

// Add parallax effect to event image
window.addEventListener('scroll', function() {
    const eventImage = document.querySelector('.event-details img');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    
    if (eventImage) {
        eventImage.style.transform = `translateY(${rate}px)`;
    }
});

// Add hover effects to meta cards
document.querySelectorAll('.meta-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});