document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('.btn-place-order').addEventListener('click', async () => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let billingForm = document.querySelector('.billing-form');
    let formData = new FormData(billingForm);
    let payload = {
      cart,
      billing: Object.fromEntries(formData)
    };
    let res = await fetch('https://your-api.com/checkout', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
    let data = await res.json();
    if (data.success) {
      alert('Order placed!');
      localStorage.removeItem('cart');
      window.location.href = 'Home.html';
    } else {
      alert('Checkout failed');
    }
  });
});