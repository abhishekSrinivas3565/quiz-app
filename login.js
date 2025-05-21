document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    // For MVP: Hardcoded credentials
    const credentials = {
        elite: { username: 'elite', password: 'elite123' },
        admin: { username: 'admin', password: 'admin123' }
    };

    if (role === "candidate") {
        // Candidate login doesn't require credentials
        localStorage.setItem("role", "candidate");
        window.location.href = "quiz-start.html";
        return;
    }

    const user = credentials[role];

    if (user && username === user.username && password === user.password) {
        localStorage.setItem("role", role);
        if (role === "elite") {
            window.location.href = "elite-dashboard.html";
        } else if (role === "admin") {
            localStorage.setItem("adminLoggedIn", "true"); // Set the adminLoggedIn flag
            window.location.href = "admin.html";
        }
    } else {
        alert("Incorrect credentials!");
    }
});

// Optional: Check for previously logged-in admin on page load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('role') === 'admin' && localStorage.getItem('adminLoggedIn') === 'true') {
        window.location.href = 'admin.html';
    } else if (localStorage.getItem('role') === 'elite') {
        window.location.href = 'elite-dashboard.html';
    } else if (localStorage.getItem('role') === 'candidate') {
        window.location.href = 'quiz-start.html';
    }
});