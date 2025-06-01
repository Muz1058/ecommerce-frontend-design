// Show products on .related-items-grid (Home, Category, etc)
document.addEventListener("DOMContentLoaded", function () {
  const grid = document.querySelector('.related-items-grid');
  if (grid) {
    MockAPI.getProducts().then(products => {
      grid.innerHTML = "";
      products.forEach(product => {
        grid.innerHTML += `
          <div class="item">
            <div class="item-header">
              ${product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : ""}
              <div class="item-actions">
                <button class="action-btn wishlist-btn"><img src="resourses/heart.svg" alt="wishlist"></button>
                <button class="action-btn view-btn"><img src="resourses/view.svg" alt="view"></button>
              </div>
              <img src="${product.image}" alt="${product.name}">
              <button class="add-to-cart" data-id="${product.id}">Add To Cart</button>
            </div>
            <div class="item-info">
              <div class="item-name">${product.name}</div>
              <div class="item-price">
                <span class="current-price">$${product.price}</span>
                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ""}
              </div>
              <div class="item-rating">
                <div class="stars">${"★".repeat(product.rating)}</div>
                <span class="rating-text">(${product.ratingCount})</span>
              </div>
            </div>
          </div>
        `;
      });
      grid.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.onclick = () => {
          let id = btn.getAttribute('data-id');
          let cart = MockAPI.getCart();
          let found = cart.find(i => i.id === id);
          if (found) found.qty++;
          else cart.push({id, qty: 1});
          MockAPI.setCart(cart);
          alert("Added to cart!");
        };
      });
    });
  }
});