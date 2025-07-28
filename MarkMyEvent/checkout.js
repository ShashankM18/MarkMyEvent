// Enhanced Checkout Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    displayCart();
    updateCartCount();
    initializePaymentForm();
    addPageAnimations();
});

// Function to display cart items with enhanced UI
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartSummary = document.getElementById('cart-summary');

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartSummary.style.display = 'none';
        emptyCart.classList.add('fade-in-up');
        return;
    }

    emptyCart.style.display = 'none';
    cartSummary.style.display = 'block';

    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item slide-in-right';
        cartItemElement.innerHTML = `
            <div class="cart-item-header">
                <h2>${item.title}</h2>
                <button class="remove-btn" onclick="removeFromCart(${index})" title="Remove item">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="cart-item-details">
                <div class="cart-detail">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Date: ${item.date}</span>
                </div>
                <div class="cart-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Venue: ${item.venue}</span>
                </div>
                <div class="cart-detail">
                    <i class="fas fa-ticket-alt"></i>
                    <span>Quantity: ${item.quantity} ticket(s)</span>
                </div>
                <div class="cart-detail">
                    <i class="fas fa-rupee-sign"></i>
                    <span>Price: ₹${item.price} each</span>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-total">₹${itemTotal.toLocaleString()}</div>
            </div>
        `;
        
        cartContainer.appendChild(cartItemElement);
        
        // Add staggered animation
        setTimeout(() => {
            cartItemElement.classList.add('animate-in');
        }, index * 100);
    });

    // Update summary
    updateCartSummary(subtotal);
}

// Update cart summary with calculations
function updateCartSummary(subtotal) {
    const serviceFeeRate = 0.05; // 5% service fee
    const serviceFee = Math.round(subtotal * serviceFeeRate);
    const total = subtotal + serviceFee;

    document.getElementById('subtotal').textContent = subtotal.toLocaleString();
    document.getElementById('service-fee').textContent = serviceFee.toLocaleString();
    document.getElementById('total').textContent = total.toLocaleString();
}

// Update quantity of cart item
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        cart[index].quantity += change;
        
        // Remove item if quantity becomes 0
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
            return;
        }
        
        // Update total for this item
        cart[index].total = cart[index].price * cart[index].quantity;
        
        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Refresh display
        displayCart();
        updateCartCount();
        
        // Show notification
        showNotification(`Updated quantity to ${cart[index].quantity}`, 'success', 2000);
    }
}

// Enhanced remove from cart function
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        const itemName = cart[index].title;
        
        // Remove the selected item using its index
        cart.splice(index, 1);
        
        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Refresh the cart display
        displayCart();
        updateCartCount();
        
        // Show notification
        showNotification(`${itemName} removed from cart`, 'warning', 2000);
    }
}

// Enhanced proceed to checkout function
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showNotification('Your cart is empty. Add some tickets first!', 'warning');
        return;
    }
    
    // Populate payment modal
    populatePaymentModal(cart);
    
    // Show payment modal
    document.getElementById('payment-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add animation
    setTimeout(() => {
        document.querySelector('.modal-content').classList.add('modal-show');
    }, 10);
}

// Populate payment modal with cart data
function populatePaymentModal(cart) {
    const paymentItems = document.getElementById('payment-items');
    let subtotal = 0;
    
    paymentItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'payment-item';
        itemElement.innerHTML = `
            <span class="payment-item-name">${item.title}</span>
            <span class="payment-item-qty">${item.quantity}x ₹${item.price}</span>
            <span class="payment-item-total">₹${itemTotal.toLocaleString()}</span>
        `;
        paymentItems.appendChild(itemElement);
    });
    
    const serviceFee = Math.round(subtotal * 0.05);
    const total = subtotal + serviceFee;
    
    document.getElementById('payment-total').textContent = total.toLocaleString();
}

// Close payment modal
function closePaymentModal() {
    document.querySelector('.modal-content').classList.remove('modal-show');
    
    setTimeout(() => {
        document.getElementById('payment-modal').style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// Initialize payment form functionality
function initializePaymentForm() {
    const form = document.getElementById('payment-form');
    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry-date');
    const cvvInput = document.getElementById('cvv');
    
    // Format card number input
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = formattedValue;
    });
    
    // Format expiry date input
    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
    
    // Only allow numbers in CVV
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment();
    });
}

// Process payment (simulation)
function processPayment() {
    const submitBtn = document.querySelector('.payment-submit');
    const originalText = submitBtn.innerHTML;
    
    // Show processing state
    submitBtn.innerHTML = '<span class="loading"><i class="spinner"></i> Processing...</span>';
    submitBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Clear cart
        localStorage.setItem('cart', JSON.stringify([]));
        
        // Close modal
        closePaymentModal();
        
        // Show success message
        showNotification('Payment successful! Your tickets have been booked.', 'success', 5000);
        
        // Redirect to home page after a delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    }, 3000);
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
        
        if (cart.length > 0) {
            cartCountElement.parentElement.classList.add('cart-has-items');
        } else {
            cartCountElement.parentElement.classList.remove('cart-has-items');
        }
    }
}

// Add page animations
function addPageAnimations() {
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
    document.querySelectorAll('.cart-item, .cart-summary').forEach(element => {
        observer.observe(element);
    });
}

// Notification system
function showNotification(message, type = 'success', duration = 3000) {
    const container = document.getElementById('notification-container');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
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

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('payment-modal');
    if (e.target === modal) {
        closePaymentModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePaymentModal();
    }
});

// Add enhanced CSS for checkout page
const checkoutStyles = document.createElement('style');
checkoutStyles.textContent = `
    .checkout-content {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .cart-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .remove-btn {
        background: var(--danger-color);
        color: white;
        border: none;
        border-radius: var(--border-radius-sm);
        padding: 0.5rem;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .remove-btn:hover {
        background: #dc2626;
        transform: scale(1.05);
    }
    
    .cart-detail {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        color: var(--gray-600);
    }
    
    .cart-detail i {
        color: var(--primary-color);
        width: 1rem;
    }
    
    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .quantity-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition);
    }
    
    .quantity-btn:hover {
        background: var(--primary-dark);
        transform: scale(1.1);
    }
    
    .quantity-display {
        min-width: 2rem;
        text-align: center;
        font-weight: 600;
    }
    
    .cart-summary {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: var(--border-radius-lg);
        padding: 2rem;
        margin-top: 2rem;
        box-shadow: var(--shadow-lg);
    }
    
    .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .total-row {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--primary-color);
        border-bottom: none;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 2px solid var(--primary-color);
    }
    
    .checkout-btn {
        width: 100%;
        margin-top: 2rem;
        padding: 1rem 2rem;
        font-size: 1.125rem;
    }
    
    /* Modal Styles */
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        background: white;
        border-radius: var(--border-radius-lg);
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.7);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .modal-content.modal-show {
        transform: scale(1);
        opacity: 1;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--gray-500);
        transition: color 0.2s;
    }
    
    .modal-close:hover {
        color: var(--gray-700);
    }
    
    .modal-body {
        padding: 2rem;
    }
    
    .payment-summary {
        background: var(--gray-100);
        border-radius: var(--border-radius);
        padding: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .payment-item {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 1rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .payment-item:last-child {
        border-bottom: none;
    }
    
    .payment-total {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--primary-color);
        text-align: center;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 2px solid var(--primary-color);
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .form-group input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--gray-200);
        border-radius: var(--border-radius);
        font-size: 1rem;
        transition: var(--transition);
    }
    
    .form-group input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    
    .payment-submit {
        width: 100%;
        padding: 1rem 2rem;
        font-size: 1.125rem;
    }
    
    @media (max-width: 768px) {
        .cart-item-actions {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
        }
        
        .modal-content {
            width: 95%;
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(checkoutStyles);
  
  