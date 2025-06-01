// For checkout.html - send order to backend
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.querySelector('.btn-place-order');
    if (!btn) return;
    btn.onclick = async function () {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        let form = document.querySelector('.billing-form');
        let formData = new FormData(form);
        let billing = Object.fromEntries(formData);

        let token = localStorage.getItem('token') || '';
        let payload = { cart, billing };

        let res = await fetch('https://api.example.com/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(payload)
        });
        let data = await res.json();
        if (data.success) {
            alert("Order placed!");
            localStorage.removeItem('cart');
            window.location.href = "Home.html";
        } else {
            alert(data.message || "Checkout failed");
        }
    };
});