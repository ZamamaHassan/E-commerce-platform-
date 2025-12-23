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
    
    // Only require size if size selector exists, has multiple options (more than just "Select Size"), and size is not selected
    if (productSize && productSize.options.length > 1) {
      const hasNonEmptyOptions = Array.from(productSize.options).some(opt => opt.value && opt.value !== '');
      if (hasNonEmptyOptions && !size) {
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

// ===== CART PAGE FUNCTIONALITY =====

function renderCartItems() {
  const cartItemsContainer = document.querySelector('.cart-items');
  if (!cartItemsContainer) return;

  const cart = getCartItems();
  const cartTitle = document.querySelector('.cart-title');
  
  // Get the cart-bottom-actions and cart-services sections (if they exist) before modifying
  const bottomActions = cartItemsContainer.querySelector('.cart-bottom-actions');
  const cartServices = cartItemsContainer.querySelector('.cart-services');
  const existingBottomActions = bottomActions ? bottomActions.outerHTML : '';
  const existingServices = cartServices ? cartServices.outerHTML : '';
  
  if (cart.length === 0) {
    if (cartTitle) cartTitle.textContent = 'My cart (0)';
    const emptyCartHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <h2 style="margin-bottom: 20px;">Your cart is empty</h2>
        <a href="index.html" style="color: #1C1C1C; text-decoration: underline;">Continue shopping</a>
      </div>
    `;
    cartItemsContainer.innerHTML = emptyCartHTML + existingBottomActions + existingServices;
    updateCartSummary([]);
    return;
  }

  // Calculate total items (sum of quantities)
  const totalItems = cart.reduce((sum, item) => sum + parseInt(item.quantity || 1), 0);
  if (cartTitle) cartTitle.textContent = `My cart (${totalItems})`;

  const cartItemsHTML = cart.map((item, index) => {
    const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    const itemQuantity = parseInt(item.quantity) || 1;
    const totalPrice = (itemPrice * itemQuantity).toFixed(2);
    
    // Generate quantity options
    const quantityOptions = Array.from({ length: 20 }, (_, i) => i + 1)
      .map(qty => `<option value="${qty}" ${qty === itemQuantity ? 'selected' : ''}>${qty}</option>`)
      .join('');

    return `
      <div class="cart-item" data-item-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-attributes">Size: ${item.size || 'N/A'}, Color: ${item.color || 'N/A'}, Material: ${item.material || 'N/A'}</div>
          <div class="cart-item-seller">Seller: ${item.seller}</div>
          <div class="cart-item-actions">
            <a href="#" class="cart-action-remove" data-item-id="${item.id}">Remove</a>
            <a href="#" class="cart-action-save">Save for later</a>
          </div>
        </div>
        <div class="cart-item-qty">
          <label>Qty:</label>
          <select class="cart-qty-select" data-item-id="${item.id}">
            ${quantityOptions}
          </select>
        </div>
        <div class="cart-item-price">$${totalPrice}</div>
      </div>
    `;
  }).join('');

  // Insert cart items before bottom actions or services
  cartItemsContainer.innerHTML = cartItemsHTML + existingBottomActions + existingServices;

  // Add event listeners for remove buttons
  const removeButtons = cartItemsContainer.querySelectorAll('.cart-action-remove');
  removeButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const itemId = this.getAttribute('data-item-id');
      const updatedCart = removeFromCart(itemId);
      renderCartItems();
    });
  });

  // Add event listeners for quantity selects
  const quantitySelects = cartItemsContainer.querySelectorAll('.cart-qty-select');
  quantitySelects.forEach(select => {
    select.addEventListener('change', function() {
      const itemId = this.getAttribute('data-item-id');
      const quantity = this.value;
      updateCartQuantity(itemId, quantity);
      renderCartItems();
    });
  });

  // Handle remove all button
  const removeAllBtn = cartItemsContainer.querySelector('.cart-remove-all');
  if (removeAllBtn) {
    removeAllBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Are you sure you want to remove all items from your cart?')) {
        saveCartItems([]);
        renderCartItems();
      }
    });
  }

  updateCartSummary(cart);
}

function updateCartSummary(cart) {
  // Find the subtotal row (first summary-row that's not discount, tax, or total)
  const summaryRows = document.querySelectorAll('.summary-row');
  let subtotalEl = null;
  let totalEl = null;
  
  summaryRows.forEach(row => {
    if (!row.classList.contains('discount') && 
        !row.classList.contains('tax') && 
        !row.classList.contains('total')) {
      subtotalEl = row.querySelector('span:last-child');
    }
    if (row.classList.contains('total')) {
      totalEl = row.querySelector('span:last-child');
    }
  });
  
  if (cart.length === 0) {
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    if (totalEl) totalEl.textContent = '$0.00';
    return;
  }

  let subtotal = 0;
  cart.forEach(item => {
    const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    const itemQuantity = parseInt(item.quantity) || 1;
    subtotal += itemPrice * itemQuantity;
  });

  const discount = 60.00; // Fixed discount for now
  const tax = 14.00; // Fixed tax for now
  const total = subtotal - discount + tax;

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Initialize cart page on load
if (document.querySelector('.cart-items')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCartItems);
  } else {
    renderCartItems();
  }
}

