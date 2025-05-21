// Ensure question.js is loaded BEFORE script.js in your HTML for htmlQuestions, cssQuestions, jsQuestions to be defined.

// --- Global Variables (accessible across page-specific blocks) ---
// These will be populated from localStorage when a page loads if a quiz is in progress.
let candidateName = '';
let candidateEmail = '';
let currentModuleIndex = 0; // Tracks which module is currently active in the sequence
let userModuleScores = {};  // Stores scores for each module e.g., {html: 8, css: 7, javascript: 9}
let startTime = 0;          // Unix timestamp for when the overall quiz started
let selectedQuestions = []; // Questions for the current module being played
let currentQuestionIndex = 0; // Current question within the 'selectedQuestions' array
let userAnswers = [];       // User's answers for the current module
let timeLeft = 0;           // Time left for the *current* module
let timerInterval;          // Stores the interval ID for the timer

const moduleSequence = ['html', 'css', 'javascript']; // Define module sequence globally

// --- Utility Functions (used across different pages) ---

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) { // Check if timer display exists on this page
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function saveQuizProgress() {
    // Saves current module's state. Overall quiz state (name, email, module index, scores) is handled separately.
    localStorage.setItem('currentModuleProgress', JSON.stringify({
        currentQuestionIndex: currentQuestionIndex,
        userAnswers: userAnswers,
        selectedQuestions: selectedQuestions,
        timeLeft: timeLeft
    }));
}

function loadQuizProgress() {
    const saved = localStorage.getItem('currentModuleProgress');
    if (saved) {
        const data = JSON.parse(saved);
        currentQuestionIndex = data.currentQuestionIndex;
        userAnswers = data.userAnswers;
        selectedQuestions = data.selectedQuestions;
        timeLeft = data.timeLeft;
        return true;
    }
    return false;
}

// --- Page Specific Logic based on URL ---

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

    // --- Logic for index.html (Candidate Start Page) ---
    if (currentPage === 'quiz-start.html' || currentPage === '') {
        const form = document.getElementById('candidate-form');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const moduleSelect = document.getElementById('module-select');
        const resumeInput = document.getElementById('resume');
        const fileNameDisplay = document.getElementById('file-name-display');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                candidateName = nameInput.value.trim();
                candidateEmail = emailInput.value.trim();
                const selectedModule = moduleSelect.value;

                if (!candidateName || !candidateEmail || !selectedModule) {
                    alert('Please fill in your Name and Email, and select a Quiz Module to start.');
                    return;
                }

                // Store initial candidate data and quiz state in localStorage
                localStorage.setItem('candidateName', candidateName);
                localStorage.setItem('candidateEmail', candidateEmail);
                localStorage.setItem('currentModuleIndex', JSON.stringify(moduleSequence.indexOf(selectedModule)));
                localStorage.setItem('userModuleScores', JSON.stringify({})); // Initialize empty scores
                localStorage.setItem('startTime', Date.now()); // Overall quiz start time

                // Redirect to the quiz questions page
                window.location.href = 'question.html';
            });
        }

        // Resume file name display logic for index.html
        if (resumeInput) {
            resumeInput.addEventListener('change', function () {
                const fileName = this.files[0]?.name || "No file chosen";
                if (fileNameDisplay) fileNameDisplay.textContent = fileName;
            });
        }

    }
    // --- Logic for quiz-questions.html (Actual Quiz Page) ---
    else if (currentPage === 'question.html') {
        // Retrieve overall quiz state from localStorage
        candidateName = localStorage.getItem('candidateName') || '';
        candidateEmail = localStorage.getItem('candidateEmail') || '';
        currentModuleIndex = JSON.parse(localStorage.getItem('currentModuleIndex') || '0');
        userModuleScores = JSON.parse(localStorage.getItem('userModuleScores') || '{}');
        startTime = parseInt(localStorage.getItem('startTime') || '0');

        // If essential data is missing (e.g., direct URL access), redirect to start
        if (!candidateName || !candidateEmail || !startTime) {
            alert("Please start the quiz from the candidate details page.");
            window.location.href = 'quiz-start.html';
            return;
        }

        // UI Elements for quiz-questions.html
        const questionText = document.getElementById('question-text');
        const optionsList = document.getElementById('options-list');
        const nextBtn = document.getElementById('next-btn');
        const currentQ = document.getElementById('current');
        const totalQ = document.getElementById('total');
        const timerDisplay = document.getElementById('timer'); // Already handled globally
        const progressBarFill = document.querySelector('.progress-bar .progress-fill');
        const quizContainer = document.getElementById('quiz-container');
        const loadingNext = document.getElementById('loading-next');

        function startTimer() {
            updateTimerDisplay(); // Initial display
            clearInterval(timerInterval); // Clear any existing timer
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                saveQuizProgress(); // Save current module progress frequently

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    alert(`Time's up for the ${moduleSequence[currentModuleIndex].toUpperCase()} module!`);
                    showResult(); // Automatically move to next module or final results
                }
            }, 1000);
        }

        function showQuestion() {
             // Always hide loading screen when showing a new question
            loadingNext.classList.add('hidden');

            nextBtn.disabled = true; // Disable next button until an option is selected

            if (currentQuestionIndex < selectedQuestions.length) {
                const question = selectedQuestions[currentQuestionIndex];
                questionText.textContent = question.question;
                optionsList.innerHTML = '';

                shuffleArray(question.options).forEach(option => {
                    const li = document.createElement('li');
                    li.textContent = option;
                    li.onclick = () => selectOption(li, option);
                    if (userAnswers[currentQuestionIndex] === option) {
                        li.classList.add('selected');
                        nextBtn.disabled = false;
                    }
                    optionsList.appendChild(li);
                });

                currentQ.textContent = currentQuestionIndex + 1;
                totalQ.textContent = selectedQuestions.length;

                if (progressBarFill) {
                    const progressPercentage = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;
                    progressBarFill.style.width = `${progressPercentage}%`;
                }
            } else {
                if (progressBarFill) {
                    progressBarFill.style.width = '100%';
                }
                showResult(); // Current module finished
            }
        }

        function selectOption(selectedLi, selectedAnswer) {
            [...optionsList.children].forEach(li => li.classList.remove('selected'));
            selectedLi.classList.add('selected');
            nextBtn.disabled = false;
            userAnswers[currentQuestionIndex] = selectedAnswer;
            saveQuizProgress();
        }

        function loadModuleQuiz(moduleName) {
            // Ensure loading screen is hidden before showing questions
            loadingNext.classList.add('hidden');

            let moduleData;
            if (moduleName === 'html') {
                moduleData = htmlQuestions;
            } else if (moduleName === 'css') {
                moduleData = cssQuestions;
            } else if (moduleName === 'javascript') {
                moduleData = jsQuestions;
            } else {
                showResult(); // Should only happen if sequence is exhausted
                return;
            }

            selectedQuestions = shuffleArray(moduleData).slice(0, 10);
            currentQuestionIndex = 0;
            userAnswers = Array(selectedQuestions.length).fill(null);
            timeLeft = 800; // ~13 minutes per module (10 questions * 80 seconds)

            // Ensure correct sections are visible/hidden
            quizContainer.classList.remove('hidden');
            loadingNext.classList.add('hidden');

            totalQ.textContent = selectedQuestions.length;
            startTimer();
            showQuestion();
        }

        function showResult() {
            clearInterval(timerInterval);

            // Calculate score for the *current* module
            const currentModuleScore = selectedQuestions.reduce((acc, q, i) => {
                return acc + (userAnswers[i] === q.answer ? 1 : 0);
            }, 0);

            const currentModule = moduleSequence[currentModuleIndex];
            userModuleScores[currentModule] = currentModuleScore; // Store score for the current module

            // Update overall state in localStorage
            localStorage.setItem('userModuleScores', JSON.stringify(userModuleScores));
            localStorage.setItem('currentModuleIndex', JSON.stringify(currentModuleIndex));
            localStorage.removeItem('currentModuleProgress'); // Clear module-specific progress

            alert(`✅ ${currentModule.toUpperCase()} Module Completed. You scored ${currentModuleScore} out of ${selectedQuestions.length}.`);

            currentModuleIndex++; // Prepare for next module

            if (currentModuleIndex < moduleSequence.length) {
                // More modules to go, show loading screen, then load next module's quiz
                quizContainer.classList.add('hidden');
                loadingNext.classList.remove('hidden');

                // Update localStorage to reflect the new module index
                localStorage.setItem('currentModuleIndex', JSON.stringify(currentModuleIndex));

                setTimeout(() => {
                    loadingNext.classList.add('hidden');
                    loadModuleQuiz(moduleSequence[currentModuleIndex]); // Load the next module directly
                }, 3000); // 3-second delay
            } else {
                // All modules completed, redirect to results page
                window.location.href = 'quiz-results.html';
            }
        }

        // Initialize quiz on page load
        // First, load overall state, then try to load current module's specific progress
        if (loadQuizProgress()) {
            // Resume current module
            startTimer();
            showQuestion();
        } else {
            // Start a new module (either first module or next in sequence)
            loadModuleQuiz(moduleSequence[currentModuleIndex]);
        }

        // Next button event listener for quiz-questions.html
        nextBtn.addEventListener('click', () => {
            if (userAnswers[currentQuestionIndex] !== null && userAnswers[currentQuestionIndex] !== undefined) {
                currentQuestionIndex++;
                saveQuizProgress();
                showQuestion();
            } else {
                alert("Please select an option before proceeding.");
            }
        });
    }
    // --- Logic for quiz-results.html (Results Page) ---
    else if (currentPage === 'quiz-results.html') {
        const scoreText = document.getElementById('score-text');
        const timeTakenDisplay = document.getElementById('time-taken-display');
        const retakeQuizBtn = document.getElementById('retake-quiz-btn');
        const homeBtn = document.getElementById('home-btn');

        // Retrieve final data from localStorage
        candidateName = localStorage.getItem('candidateName') || 'N/A';
        candidateEmail = localStorage.getItem('candidateEmail') || 'N/A';
        userModuleScores = JSON.parse(localStorage.getItem('userModuleScores') || '{}');
        startTime = parseInt(localStorage.getItem('startTime') || '0');

        const totalTimeSeconds = Math.floor((Date.now() - startTime) / 1000);

        // Display results
        let summaryHtml = `<h3 style="color: var(--oracle-dark-blue);">Candidate: ${candidateName} (${candidateEmail})</h3>`;
        summaryHtml += '<h3>Module Scores:</h3><ul>';
        for (const [mod, sc] of Object.entries(userModuleScores)) {
            summaryHtml += `<li>${mod.toUpperCase()}: ${sc} / 10</li>`;
        }
        summaryHtml += '</ul>';
        scoreText.innerHTML = summaryHtml;

        const totalMinutes = Math.floor(totalTimeSeconds / 60);
        const totalSeconds = totalTimeSeconds % 60;
        timeTakenDisplay.textContent = `${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

        // Save overall candidate results for admin/elite dashboards
        const candidateFinalData = {
            name: candidateName,
            email: candidateEmail,
            scores: userModuleScores,
            timeTaken: totalTimeSeconds,
            completionDate: new Date().toISOString() // Add completion date
        };

        const existingCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
        existingCandidates.push(candidateFinalData);
        localStorage.setItem('candidates', JSON.stringify(existingCandidates));

        // Clear all quiz-specific localStorage items after showing results
        localStorage.removeItem('candidateName');
        localStorage.removeItem('candidateEmail');
        localStorage.removeItem('currentModuleIndex');
        localStorage.removeItem('userModuleScores');
        localStorage.removeItem('startTime');
        localStorage.removeItem('currentModuleProgress'); // Ensure this is cleared


        // Event listeners for result page buttons
        if (retakeQuizBtn) {
            retakeQuizBtn.addEventListener('click', () => {
                window.location.href = 'login.html'; // Go back to start page
            });
        }

        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                window.location.href = 'login.html'; // Go back to login page
            });
        }
    }
    // --- Other pages (e.g., login.html, admin.html, elite-dashboard.html) ---
    // If you have a single script.js for all pages, you'd add similar `else if` blocks here
    // for their specific DOMContentLoaded logic.
});

// Important: Ensure question.js is linked before script.js in your HTML files.
// <script src="question.js"></script>
// <script src="script.js"></script>