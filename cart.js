document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector('.cart-table tbody');
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  // Fetch product info from API for items in cart
  fetch('https://your-api.com/products?ids=' + cart.map(i=>i.id).join(','))
    .then(res => res.json())
    .then(products => {
      tbody.innerHTML = '';
      let total = 0;
      cart.forEach(item => {
        const prod = products.find(p=>p.id==item.id);
        let subtotal = prod.price * item.qty;
        total += subtotal;
        tbody.innerHTML += `
          <tr class="cart-item" data-id="${prod.id}">
            <td class="product-cell">
              <div class="product-info">
                <div class="product-image"><img src="${prod.image}" alt="${prod.name}"></div>
                <span class="product-name">${prod.name}</span>
              </div>
            </td>
            <td class="price-cell">$${prod.price}</td>
            <td class="quantity-cell">
              <div class="quantity-controls">
                <input type="number" class="quantity-input" value="${item.qty}" min="1">
              </div>
            </td>
            <td class="subtotal-cell">$${subtotal}</td>
          </tr>
        `;
      });
      document.querySelector('.cart-total-value').textContent = `$${total}`;
      // Quantity change
      tbody.querySelectorAll('.quantity-input').forEach(inp => {
        inp.addEventListener('change', function() {
          let row = this.closest('.cart-item');
          let id = row.getAttribute('data-id');
          let cart = JSON.parse(localStorage.getItem('cart') || '[]');
          let found = cart.find(i => i.id == id);
          found.qty = parseInt(this.value);
          localStorage.setItem('cart', JSON.stringify(cart));
          location.reload();
        });
      });
    });
  // Checkout button
  document.querySelector('.btn-checkout').addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });
});