document.addEventListener('DOMContentLoaded', () => {
    // Check if admin is logged in
    if (localStorage.getItem("adminLoggedIn") !== "true") {
        window.location.href = "login.html"; // Redirect to admin login page if not logged in
        return; // Stop further execution
    }

    const tableBody = document.querySelector("#candidateTable tbody");
    const moduleFilter = document.getElementById("moduleFilter");
    const logoutBtn = document.getElementById("logoutBtn");

    // Function to render the candidate table
    function renderTable(data) {
        tableBody.innerHTML = ""; // Clear existing table rows

        data.forEach(candidate => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${candidate.name}</td>
                <td>${candidate.email}</td>
                <td>${candidate.module ? candidate.module.toUpperCase() : '-'}</td>
                <td>${candidate.score !== undefined ? candidate.score : '-'}</td>
                <td>${candidate.time || '-'}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Function to get candidate data (currently from localStorage)
    function getCandidateData() {
        return JSON.parse(localStorage.getItem("candidates")) || [];
    }

    // Initial load of candidate data and table rendering
    const initialCandidates = getCandidateData();
    renderTable(initialCandidates);

    // Event listener for module filter
    if (moduleFilter) {
        moduleFilter.addEventListener("change", () => {
            const selectedModule = moduleFilter.value;
            const allCandidates = getCandidateData();
            let filteredCandidates = [];

            if (selectedModule === "all") {
                filteredCandidates = allCandidates;
            } else {
                filteredCandidates = allCandidates.filter(c => c.module === selectedModule);
            }
            renderTable(filteredCandidates);
        });
    }

    // Event listener for logout button
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("adminLoggedIn");
            window.location.href = "login.html"; // Redirect to the main login page
        });
    }
});