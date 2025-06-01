// For signUp.html
document.addEventListener("DOMContentLoaded", function () {
  // Signup
  const createBtn = document.querySelector('.create-btn');
  if (createBtn) {
    createBtn.onclick = async () => {
      const name = document.querySelectorAll('.input-field')[0].value;
      const email = document.querySelectorAll('.input-field')[1].value;
      const password = document.querySelectorAll('.input-field')[2].value;
      try {
        await MockAPI.signup({name, email, password});
        alert('Account created! You are now logged in.');
        window.location.href = "Home.html";
      } catch (e) {
        alert(e.message || "Signup failed.");
      }
    };
  }
  // Login (if you have logIn.html)
  const loginBtn = document.querySelector('.login-btn');
  if (loginBtn) {
    loginBtn.onclick = async () => {
      const email = document.querySelectorAll('.input-field')[0].value;
      const password = document.querySelectorAll('.input-field')[1].value;
      try {
        await MockAPI.login({email, password});
        alert('Logged in!');
        window.location.href = "Home.html";
      } catch (e) {
        alert(e.message || "Login failed.");
      }
    };
  }
});