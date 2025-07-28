// Function to display cart items 
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
  
    cartContainer.innerHTML = ''; 
  
    if (cart.length === 0) {
      cartContainer.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }
  
    cart.forEach((item, index) => {
      const totalPrice = item.price * item.quantity;
      cartContainer.innerHTML += `
        <div class="cart-item">
          <h2>${item.title}</h2>
          <p>Date: ${item.date}</p>
          <p>Venue: ${item.venue}</p>
          <p>${item.quantity} Ticket(s) - Rs.${totalPrice}</p>
          <button onclick="removeFromCart(${index})">Remove</button>
        </div>
      `;
    });
  }
  
  // Function to remove a ticket from the cart
  function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Remove the selected ticket using its index
    cart.splice(index, 1);
  
    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  
    // Refresh the cart display
    displayCart();
  
    // Update the cart count
    updateCartCount();
  }
  
  // Proceed to checkout function
  function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      alert('Your cart is empty.');
    } else {
      alert('Proceeding to payment...');
      //Can add payment functionality here (Future Enhancement)
    }
  }
  
  // Update cart count
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').textContent = cart.length;
  }
  
  // Call displayCart on page load
  document.addEventListener('DOMContentLoaded', function() {
    displayCart();
    updateCartCount();
  });
  
  