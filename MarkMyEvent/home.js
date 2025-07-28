// Global variables
let currentFilter = 'all';
let searchTerm = '';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 1000);

    // Update cart count
    updateCartCount();
    
    // Initialize search functionality
    initializeSearch();
    
    // Add scroll effects
    initializeScrollEffects();
    
    // Add intersection observer for animations
    initializeAnimations();
});

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

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchTerm = e.target.value.toLowerCase();
            filterAndSearchEvents();
        });
    }
}

// Filter events by category
function filterEvents(category) {
    currentFilter = category;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    filterAndSearchEvents();
}

// Combined filter and search function
function filterAndSearchEvents() {
    const events = document.querySelectorAll('.event');
    
    events.forEach(event => {
        const category = event.dataset.category;
        const title = event.querySelector('h3').textContent.toLowerCase();
        const venue = event.querySelector('.event-meta-item:nth-child(2) span:last-child').textContent.toLowerCase();
        
        const matchesFilter = currentFilter === 'all' || category === currentFilter;
        const matchesSearch = searchTerm === '' || 
                            title.includes(searchTerm) || 
                            venue.includes(searchTerm);
        
        if (matchesFilter && matchesSearch) {
            event.style.display = 'block';
            event.classList.add('animate-slideInUp');
        } else {
            event.style.display = 'none';
        }
    });
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

// Initialize animations with Intersection Observer
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slideInUp');
            }
        });
    }, observerOptions);
    
    // Observe all event cards
    document.querySelectorAll('.event').forEach(event => {
        observer.observe(event);
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
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    
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
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add smooth scrolling to anchor links
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
    btn.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            this.classList.add('loading');
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="spinner"></span> Loading...';
            
            setTimeout(() => {
                this.classList.remove('loading');
                this.innerHTML = originalText;
            }, 1000);
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const nav = document.getElementById('nav');
        nav.classList.remove('active');
    }
    
    // Enter key to search
    if (e.key === 'Enter' && e.target.id === 'searchInput') {
        e.target.blur();
        showToast('Search completed!', 'info');
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Performance optimization: Debounce search
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

// Apply debounce to search
const debouncedSearch = debounce(filterAndSearchEvents, 300);

// Update search input to use debounced function
document.getElementById('searchInput')?.addEventListener('input', function(e) {
    searchTerm = e.target.value.toLowerCase();
    debouncedSearch();
});