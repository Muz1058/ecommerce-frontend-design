// For cart.html - render cart and connect to API for product details
document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.querySelector('.cart-table tbody');
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cart.length) return;

    fetch('https://api.example.com/products?ids=' + cart.map(i => i.id).join(','))
        .then(res => res.json())
        .then(products => {
            tbody.innerHTML = '';
            let total = 0;
            cart.forEach(item => {
                const prod = products.find(p => p.id == item.id);
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
            document.querySelectorAll('.quantity-input').forEach(inp => {
                inp.addEventListener('change', function () {
                    let row = this.closest('.cart-item');
                    let id = row.getAttribute('data-id');
                    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    let found = cart.find(i => i.id == id);
                    found.qty = parseInt(this.value);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    location.reload();
                });
            });
            document.querySelectorAll('.cart-item').forEach(row => {
                row.addEventListener('dblclick', function () {
                    let id = this.getAttribute('data-id');
                    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    localStorage.setItem('cart', JSON.stringify(cart.filter(i => i.id != id)));
                    location.reload();
                });
            });
            document.querySelectorAll('.cart-total-value').forEach(span => span.textContent = `$${total}`);
        });

    document.querySelector('.btn-checkout').onclick = function () {
        window.location.href = "checkout.html";
    };
});