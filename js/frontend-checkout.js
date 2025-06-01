document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector('.btn-place-order');
  if (!btn) return;
  btn.onclick = function () {
    let cart = MockAPI.getCart();
    let form = document.querySelector('.billing-form');
    let formData = new FormData(form);
    let billing = Object.fromEntries(formData);
    if (!cart.length) return alert("Your cart is empty.");
    alert("Order placed!\n\n" +
      "Name: " + billing.firstName + "\n" +
      "Email: " + billing.emailAddress + "\n" +
      "Total items: " + cart.reduce((a,b)=>a+b.qty,0) +
      "\nThank you for shopping!");
    MockAPI.clearCart();
    window.location.href = "Home.html";
  };
});