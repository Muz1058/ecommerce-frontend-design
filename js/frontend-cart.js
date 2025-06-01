document.addEventListener("DOMContentLoaded", function () {
  const tbody = document.querySelector('.cart-table tbody');
  const cart = MockAPI.getCart();
  if (!tbody || !cart.length) return;
  MockAPI.getProducts().then(products => {
    tbody.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      const prod = products.find(p => p.id === item.id);
      const subtotal = prod.price * item.qty;
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
    document.querySelectorAll('.quantity-input').forEach(inp => {
      inp.addEventListener('change', function () {
        let row = this.closest('.cart-item');
        let id = row.getAttribute('data-id');
        let cart = MockAPI.getCart();
        let found = cart.find(i => i.id === id);
        found.qty = parseInt(this.value);
        MockAPI.setCart(cart);
        location.reload();
      });
    });
    // Cart total
    document.querySelectorAll('.cart-total-value').forEach(span => {
      span.textContent = `$${total}`;
    });
  });

  const checkoutBtn = document.querySelector('.btn-checkout');
  if (checkoutBtn) checkoutBtn.onclick = () => window.location.href = "checkout.html";
});