// Home page interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    updateCartCount();
    initializeSearch();
    initializeFilters();
    addScrollAnimations();
    
    // Add loading states and smooth transitions
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const eventList = document.getElementById('event-list');
    const emptyState = document.getElementById('empty-state');
    
    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterEvents(searchTerm);
    }, 300));
}

// Filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter events
            filterEventsByCategory(filterValue);
            
            // Add button press animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Filter events by search term
function filterEvents(searchTerm) {
    const events = document.querySelectorAll('.event');
    const emptyState = document.getElementById('empty-state');
    let visibleEvents = 0;
    
    events.forEach(event => {
        const eventName = event.getAttribute('data-name').toLowerCase();
        const eventCategory = event.getAttribute('data-category').toLowerCase();
        const eventText = event.textContent.toLowerCase();
        
        if (searchTerm === '' || 
            eventName.includes(searchTerm) || 
            eventCategory.includes(searchTerm) ||
            eventText.includes(searchTerm)) {
            
            event.style.display = 'block';
            event.classList.add('fade-in-up');
            visibleEvents++;
        } else {
            event.style.display = 'none';
            event.classList.remove('fade-in-up');
        }
    });
    
    // Show/hide empty state
    if (visibleEvents === 0) {
        emptyState.style.display = 'block';
        emptyState.classList.add('fade-in-up');
    } else {
        emptyState.style.display = 'none';
        emptyState.classList.remove('fade-in-up');
    }
}

// Filter events by category
function filterEventsByCategory(category) {
    const events = document.querySelectorAll('.event');
    const emptyState = document.getElementById('empty-state');
    let visibleEvents = 0;
    
    events.forEach((event, index) => {
        const eventCategory = event.getAttribute('data-category');
        
        if (category === 'all' || eventCategory === category) {
            event.style.display = 'block';
            
            // Add staggered animation
            setTimeout(() => {
                event.classList.add('fade-in-up');
            }, index * 100);
            
            visibleEvents++;
        } else {
            event.style.display = 'none';
            event.classList.remove('fade-in-up');
        }
    });
    
    // Show/hide empty state
    if (visibleEvents === 0) {
        emptyState.style.display = 'block';
        emptyState.classList.add('fade-in-up');
    } else {
        emptyState.style.display = 'none';
        emptyState.classList.remove('fade-in-up');
    }
}

// Clear all filters
function clearFilters() {
    // Reset search input
    document.getElementById('search-input').value = '';
    
    // Reset filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
    
    // Show all events
    filterEventsByCategory('all');
    
    // Show success notification
    showNotification('Filters cleared! Showing all events.', 'success');
}

// Update cart count from localStorage
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
        
        // Add bounce animation when count changes
        if (cart.length > 0) {
            cartCountElement.parentElement.classList.add('cart-has-items');
            animateCartCount();
        } else {
            cartCountElement.parentElement.classList.remove('cart-has-items');
        }
    }
}

// Animate cart count
function animateCartCount() {
    const cartElement = document.getElementById('cart');
    cartElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        cartElement.style.transform = '';
    }, 200);
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll animations
function addScrollAnimations() {
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
    
    // Observe all events for scroll animations
    document.querySelectorAll('.event').forEach(event => {
        observer.observe(event);
    });
}

// Enhanced card interactions
document.addEventListener('DOMContentLoaded', function() {
    const eventCards = document.querySelectorAll('.event');
    
    eventCards.forEach(card => {
        // Add mouse enter/leave effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Notification system
function showNotification(message, type = 'success', duration = 3000) {
    const container = document.getElementById('notification-container');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
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

// Smooth scrolling for internal links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading states to buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn')) {
        const button = e.target;
        const originalText = button.innerHTML;
        
        // Add loading state
        button.innerHTML = '<span class="loading"><i class="spinner"></i> Loading...</span>';
        button.disabled = true;
        
        // Simulate loading (remove this in production)
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }
});

// Add CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .cart-has-items {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(rippleStyle);