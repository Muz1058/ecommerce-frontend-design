document.addEventListener("DOMContentLoaded", () => {
  // Fetch products from API
  fetch('https://your-api.com/products')
    .then(res => res.json())
    .then(products => {
      const grid = document.querySelector('.related-items-grid');
      if (!grid) return;
      grid.innerHTML = '';
      products.forEach(prod => {
        grid.innerHTML += `
          <div class="item">
            <div class="item-header">
              <div class="discount-badge">${prod.discount || ""}</div>
              <div class="item-actions">
                <button class="action-btn wishlist-btn"><img src="resourses/heart.svg" alt="wishlist"></button>
                <button class="action-btn view-btn"><img src="resourses/view.svg" alt="view"></button>
              </div>
              <img src="${prod.image}" alt="${prod.name}">
              <button class="add-to-cart" data-product-id="${prod.id}">Add To Cart</button>
            </div>
            <div class="item-info">
              <div class="item-name">${prod.name}</div>
              <div class="item-price">
                <span class="current-price">${prod.price}</span>
                <span class="original-price">${prod.originalPrice || ""}</span>
              </div>
              <div class="item-rating">
                <div class="stars">⭐⭐⭐⭐⭐</div>
                <span class="rating-text">(${prod.ratingCount})</span>
              </div>
            </div>
          </div>
        `;
      });
      document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', e => {
          addToCart(btn.getAttribute('data-product-id'));
        });
      });
    });
});

function addToCart(productId) {
  // Example implementation
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  let found = cart.find(i => i.id == productId);
  if (found) found.qty += 1;
  else cart.push({id: productId, qty: 1});
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart!');
}