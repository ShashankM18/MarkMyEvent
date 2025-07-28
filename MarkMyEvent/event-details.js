// Event Details Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initializePriceCalculation();
    addPageAnimations();
});

// Initialize price calculation functionality
function initializePriceCalculation() {
    const quantitySelect = document.getElementById('ticket-quantity');
    const totalPriceElement = document.getElementById('total-price');
    const basePrice = parseInt(document.getElementById('event-price').textContent);
    
    if (quantitySelect && totalPriceElement) {
        quantitySelect.addEventListener('change', function() {
            const quantity = parseInt(this.value);
            const total = basePrice * quantity;
            
            // Update total price with animation
            totalPriceElement.style.transform = 'scale(1.1)';
            totalPriceElement.style.color = 'var(--primary-color)';
            
            setTimeout(() => {
                totalPriceElement.textContent = total.toLocaleString();
                totalPriceElement.style.transform = 'scale(1)';
                totalPriceElement.style.color = '';
            }, 150);
        });
    }
}

// Enhanced add to cart function
function addToCart() {
    const button = document.getElementById('add-to-cart');
    const quantity = parseInt(document.getElementById('ticket-quantity').value);
    const basePrice = parseInt(document.getElementById('event-price').textContent);
    
    // Show loading state
    const originalContent = button.innerHTML;
    button.innerHTML = '<span class="loading"><i class="spinner"></i> Adding to Cart...</span>';
    button.disabled = true;
    
    // Simulate processing time for better UX
    setTimeout(() => {
        try {
            const event = {
                id: 1, // Unique identifier for this event
                title: document.getElementById('event-title').textContent,
                date: document.getElementById('event-date').textContent,
                venue: document.getElementById('event-venue').textContent,
                price: basePrice,
                quantity: quantity,
                total: basePrice * quantity,
                timestamp: new Date().toISOString()
            };

            // Retrieve existing cart
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Check if this event is already in cart
            const existingItemIndex = cart.findIndex(item => item.id === event.id);
            
            if (existingItemIndex !== -1) {
                // Update existing item
                cart[existingItemIndex].quantity += quantity;
                cart[existingItemIndex].total = cart[existingItemIndex].price * cart[existingItemIndex].quantity;
                showNotification(`Updated cart! Now you have ${cart[existingItemIndex].quantity} tickets.`, 'success');
            } else {
                // Add new item
                cart.push(event);
                showNotification(`${quantity} ticket(s) added to cart successfully!`, 'success');
            }

            // Save updated cart
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count with animation
            updateCartCount();
            
            // Add success animation to button
            button.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
            button.classList.add('btn-success');
            
            // Reset button after delay
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.disabled = false;
            }, 2000);
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            showNotification('Failed to add to cart. Please try again.', 'error');
            
            // Reset button on error
            button.innerHTML = originalContent;
            button.disabled = false;
        }
    }, 1000);
}

// Update cart count with animation
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        const currentCount = parseInt(cartCountElement.textContent);
        const newCount = cart.length;
        
        if (newCount !== currentCount) {
            // Animate the change
            cartCountElement.style.transform = 'scale(1.3)';
            cartCountElement.style.color = 'var(--secondary-color)';
            
            setTimeout(() => {
                cartCountElement.textContent = newCount;
                cartCountElement.style.transform = 'scale(1)';
                cartCountElement.style.color = '';
                
                // Add pulse animation for cart icon
                if (newCount > 0) {
                    document.getElementById('cart').classList.add('cart-has-items');
                }
            }, 200);
        }
    }
}

// Add page animations
function addPageAnimations() {
    // Stagger animations for info items
    const infoItems = document.querySelectorAll('.event-info-item');
    infoItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('slide-in-right');
        }, index * 100);
    });
    
    // Add scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.event-description, .ticket-selection').forEach(element => {
        observer.observe(element);
    });
}

// Notification system
function showNotification(message, type = 'success', duration = 3000) {
    const container = document.getElementById('notification-container');
    
    if (!container) {
        // Create container if it doesn't exist
        const newContainer = document.createElement('div');
        newContainer.id = 'notification-container';
        document.body.appendChild(newContainer);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.getElementById('notification-container').appendChild(notification);
    
    // Trigger show animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Event listener for "Add to Cart" button
document.getElementById('add-to-cart').addEventListener('click', function (e) {
    e.preventDefault();
    addToCart();
});

// Add hover effects to interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('ticket-quantity');
    const button = document.getElementById('add-to-cart');
    
    // Enhanced select styling
    selectElement.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    selectElement.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
    
    // Button interaction effects
    button.addEventListener('mouseenter', function() {
        if (!this.disabled) {
            this.style.transform = 'translateY(-2px)';
        }
    });
    
    button.addEventListener('mouseleave', function() {
        if (!this.disabled) {
            this.style.transform = '';
        }
    });
});

// Add CSS for enhanced interactions
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    .event-description {
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--border-radius);
        padding: 2rem;
        margin: 2rem 0;
        backdrop-filter: blur(10px);
    }
    
    .event-description h3, .event-description h4 {
        color: var(--gray-800);
        margin-bottom: 1rem;
    }
    
    .event-description ul {
        list-style: none;
        padding: 0;
    }
    
    .event-description li {
        padding: 0.5rem 0;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--gray-700);
    }
    
    .event-description li i {
        color: var(--primary-color);
        width: 1.25rem;
    }
    
    .ticket-selection {
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--border-radius);
        padding: 2rem;
        margin-top: 2rem;
        backdrop-filter: blur(10px);
    }
    
    .price-summary {
        margin: 1.5rem 0;
        padding: 1rem;
        background: var(--gray-100);
        border-radius: var(--border-radius-sm);
        border-left: 4px solid var(--primary-color);
    }
    
    .total-price {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
        text-align: center;
    }
    
    .focused {
        transform: scale(1.02);
        transition: transform 0.2s ease;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        margin-left: auto;
        padding: 0.25rem;
        opacity: 0.7;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .cart-has-items {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(enhancedStyles);
  