// For account.html - update profile
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('.profile-form .form');
    if (!form) return;
    form.onsubmit = async function (e) {
        e.preventDefault();
        let token = localStorage.getItem('token') || '';
        let formData = new FormData(form);
        let data = Object.fromEntries(formData);
        let res = await fetch('https://api.example.com/account', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(data)
        });
        let out = await res.json();
        if (out.success) alert("Profile updated!");
        else alert(out.message || "Profile update failed.");
    };
});