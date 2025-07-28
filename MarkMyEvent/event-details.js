
function addToCart() {
    const quantity = document.getElementById('ticket-quantity').value;
  
    const event = {
      id: 1, // Retrieve from URL 
      title: document.getElementById('event-title').textContent,
      date: document.getElementById('event-date').textContent,
      venue: document.getElementById('event-venue').textContent,
      price: document.getElementById('event-price').textContent,
      quantity: quantity
    };
  
    // Retrieve cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Add selected event to cart
    cart.push(event);
  
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  
    alert('Tickets added to cart!');
    updateCartCount();
  }
  
  // Update cart count 
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').textContent = cart.length;
  }
  
  // Event listener for "Add to Cart" button
  document.getElementById('add-to-cart').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent page reload
    addToCart();
  });
  
  // Update cart count on page load
  document.addEventListener('DOMContentLoaded', updateCartCount);
  