// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuSidebar = document.getElementById('mobile-menu-sidebar');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileMenuClose = document.getElementById('mobile-menu-close');

function openMobileMenu() {
  mobileMenuSidebar.classList.add('active');
  mobileMenuOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenuSidebar.classList.remove('active');
  mobileMenuOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', function(e) {
    // Only open on mobile screens (check window width)
    if (window.innerWidth <= 768) {
      e.preventDefault();
      e.stopPropagation();
      openMobileMenu();
    }
  });
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener('click', closeMobileMenu);
}

if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking on a menu link
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-item, .mobile-menu-link');
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

// Close menu on window resize if desktop
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
});

// ===== PRODUCT DETAIL PAGE FUNCTIONALITY =====

// Quantity Selector
const quantityInput = document.getElementById('quantity-input');
const quantityIncrease = document.getElementById('quantity-increase');
const quantityDecrease = document.getElementById('quantity-decrease');

if (quantityIncrease) {
  quantityIncrease.addEventListener('click', function() {
    const currentValue = parseInt(quantityInput.value) || 1;
    const maxValue = parseInt(quantityInput.getAttribute('max')) || 999;
    if (currentValue < maxValue) {
      quantityInput.value = currentValue + 1;
    }
  });
}

if (quantityDecrease) {
  quantityDecrease.addEventListener('click', function() {
    const currentValue = parseInt(quantityInput.value) || 1;
    const minValue = parseInt(quantityInput.getAttribute('min')) || 1;
    if (currentValue > minValue) {
      quantityInput.value = currentValue - 1;
    }
  });
}

if (quantityInput) {
  quantityInput.addEventListener('change', function() {
    const value = parseInt(this.value) || 1;
    const minValue = parseInt(this.getAttribute('min')) || 1;
    const maxValue = parseInt(this.getAttribute('max')) || 999;
    if (value < minValue) {
      this.value = minValue;
    } else if (value > maxValue) {
      this.value = maxValue;
    }
  });
}

// ===== CART FUNCTIONALITY =====

// Cart utility functions
function getCartItems() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCartItems(items) {
  localStorage.setItem('cart', JSON.stringify(items));
  updateCartBadge();
}

function addToCart(product) {
  const cart = getCartItems();
  
  // Generate unique ID for this cart item
  const cartItemId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  product.id = cartItemId;
  
  cart.push(product);
  saveCartItems(cart);
}

function removeFromCart(itemId) {
  const cart = getCartItems();
  const updatedCart = cart.filter(item => item.id !== itemId);
  saveCartItems(updatedCart);
  return updatedCart;
}

function updateCartQuantity(itemId, quantity) {
  const cart = getCartItems();
  const updatedCart = cart.map(item => {
    if (item.id === itemId) {
      return { ...item, quantity: parseInt(quantity) };
    }
    return item;
  });
  saveCartItems(updatedCart);
  return updatedCart;
}

function updateCartBadge() {
  const cart = getCartItems();
  const totalItems = cart.reduce((sum, item) => sum + parseInt(item.quantity || 1), 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.style.display = 'inline';
    } else {
      badge.textContent = '0';
      badge.style.display = 'none';
    }
  });
}

// Initialize cart badge on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateCartBadge);
} else {
  updateCartBadge();
}

// Add to Cart Button
const addToCartBtn = document.getElementById('add-to-cart-btn');
const cartMessage = document.getElementById('cart-message');
const productSize = document.getElementById('product-size');

if (addToCartBtn) {
  addToCartBtn.addEventListener('click', function() {
    const size = productSize ? productSize.value : '';
    const quantity = quantityInput ? quantityInput.value : 1;
    
    if (productSize && !size) {
      if (cartMessage) {
        cartMessage.textContent = 'Please select a size';
        cartMessage.className = 'cart-message error';
        setTimeout(() => {
          cartMessage.textContent = '';
          cartMessage.className = 'cart-message';
        }, 3000);
      }
      return;
    }

    // Get product information from the page
    const productTitle = document.querySelector('.product-title')?.textContent || 'Product';
    const productImage = document.querySelector('.product-main-image img')?.src || '';
    const productPrice = document.querySelector('.tier-price')?.textContent || '$0.00';
    const supplierName = document.querySelector('.supplier-name')?.textContent || 'Unknown Seller';
    
    // Create product object
    const product = {
      name: productTitle,
      image: productImage,
      price: productPrice,
      size: size,
      quantity: parseInt(quantity),
      seller: supplierName,
      material: 'Plastic', // Default, can be enhanced later
      color: 'blue' // Default, can be enhanced later
    };

    // Add to cart
    addToCart(product);

    // Show success message
    if (cartMessage) {
      cartMessage.textContent = `Added ${quantity} item(s) to cart${size ? ' (Size: ' + size.toUpperCase() + ')' : ''}!`;
      cartMessage.className = 'cart-message success';
      
      // Reset after 3 seconds
      setTimeout(() => {
        cartMessage.textContent = '';
        cartMessage.className = 'cart-message';
      }, 3000);
    }
  });
}

// Product Tabs Functionality
const tabButtons = document.querySelectorAll('.tab-btn[data-tab]');
tabButtons.forEach(button => {
  button.addEventListener('click', function() {
    const tabName = this.getAttribute('data-tab');
    
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    this.classList.add('active');
    const tabContent = document.getElementById('tab-' + tabName);
    if (tabContent) {
      tabContent.classList.add('active');
    }
  });
});

// ===== SEARCH BAR ENHANCEMENT =====
const searchInputs = document.querySelectorAll('.search-input');
searchInputs.forEach(searchInput => {
  // Add focus effect
  searchInput.addEventListener('focus', function() {
    this.parentElement.classList.add('search-focused');
  });

  searchInput.addEventListener('blur', function() {
    this.parentElement.classList.remove('search-focused');
  });

  // Add input animation
  searchInput.addEventListener('input', function() {
    if (this.value.length > 0) {
      this.parentElement.classList.add('search-has-value');
    } else {
      this.parentElement.classList.remove('search-has-value');
    }
  });
});

// Search button click effect
const searchButtons = document.querySelectorAll('.search-btn');
searchButtons.forEach(searchBtn => {
  searchBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const searchInput = this.parentElement.querySelector('.search-input');
    const searchSelect = this.parentElement.querySelector('.search-select');
    
    // Visual feedback
    this.classList.add('search-clicked');
    setTimeout(() => {
      this.classList.remove('search-clicked');
    }, 200);

    // Non-functional search (styled only as requested)
    console.log('Search query:', searchInput.value);
    console.log('Category:', searchSelect ? searchSelect.value : 'All');
  });
});

