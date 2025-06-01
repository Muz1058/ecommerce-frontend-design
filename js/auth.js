// For signUp.html
document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector('.create-btn')) {
        document.querySelector('.create-btn').onclick = async () => {
            const name = document.querySelectorAll('.input-field')[0].value;
            const email = document.querySelectorAll('.input-field')[1].value;
            const password = document.querySelectorAll('.input-field')[2].value;
            const res = await fetch('https://api.example.com/auth/signup', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                alert('Account created! Redirecting...');
                window.location.href = "Home.html";
            } else {
                alert(data.message || "Signup failed.");
            }
        };
    }
    // For logIn.html (assuming similar field classes)
    if (document.querySelector('.login-btn')) {
        document.querySelector('.login-btn').onclick = async () => {
            const email = document.querySelectorAll('.input-field')[0].value;
            const password = document.querySelectorAll('.input-field')[1].value;
            const res = await fetch('https://api.example.com/auth/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                alert('Login successful! Redirecting...');
                window.location.href = "Home.html";
            } else {
                alert(data.message || "Login failed.");
            }
        };
    }
});