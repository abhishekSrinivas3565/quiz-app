document.addEventListener('DOMContentLoaded', () => {
    // --- Role-Based Access Control (Relocated from HTML for better practice) ---
    const role = localStorage.getItem('role');
    if (role !== 'elite') {
        alert("Access denied! You must be logged in as an Elite user.");
        window.location.href = 'login.html';
        return; // Stop script execution if access is denied
    }

    const locationDisplay = document.getElementById('location');
    const cameraFeed = document.getElementById('camera-feed');
    const cameraStatus = document.getElementById('camera-status');
    const candidateTableBody = document.getElementById('candidate-table-body');
    const logoutBtn = document.getElementById('logoutBtn'); // Get the logout button

    // --- 🌐 Fetch location ---
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                locationDisplay.textContent =
                    `Latitude: ${position.coords.latitude.toFixed(4)}, Longitude: ${position.coords.longitude.toFixed(4)}`;
            },
            err => {
                console.error("Geolocation error:", err);
                locationDisplay.textContent = "Location access denied or unavailable.";
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // Options for better accuracy
        );
    } else {
        locationDisplay.textContent = "Geolocation not supported by this browser.";
    }

    // --- 📷 Start camera ---
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                cameraFeed.srcObject = stream;
                cameraStatus.textContent = 'Camera feed active.';
            })
            .catch(err => {
                console.error("Camera access denied or error:", err);
                cameraFeed.style.display = 'none'; // Hide video element
                cameraStatus.textContent = "Camera access denied. Please allow camera permissions.";
            });
    } else {
        cameraFeed.style.display = 'none';
        cameraStatus.textContent = "Camera (getUserMedia) not supported by this browser.";
    }


    // --- 📊 Load and Display Candidate Data ---
    function loadCandidateData() {
        // Retrieve candidates from localStorage (assuming they are saved there after quiz)
        const candidates = JSON.parse(localStorage.getItem('candidates')) || [];

        candidateTableBody.innerHTML = ''; // Clear existing rows

        if (candidates.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `<td colspan="5" style="text-align: center; padding: 20px;">No candidate data available.</td>`;
            candidateTableBody.appendChild(noDataRow);
            return;
        }

        candidates.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.name || 'N/A'}</td>
                <td>${c.email || 'N/A'}</td>
                <td>${c.scores?.html !== undefined ? c.scores.html : '-'}</td>
                <td>${c.scores?.css !== undefined ? c.scores.css : '-'}</td>
                <td>${c.scores?.javascript !== undefined ? c.scores.javascript : '-'}</td>
            `;
            candidateTableBody.appendChild(tr);
        });
    }

    loadCandidateData(); // Call this function to display data on page load

    // --- Logout Functionality ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('role'); // Clear the elite role
            localStorage.removeItem('adminLoggedIn'); // Also clear this, just in case (though elite wouldn't have it)
            // You might want to clear other session-related items here
            window.location.href = 'login.html'; // Redirect to the main login page
        });
    }
});