// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Update progress bar
function updateProgress() {
    const progress = localStorage.getItem('sql_progress') || 0;
    const progressBar = document.getElementById('sql-progress');
    const progressText = document.getElementById('progress-text');

    if (progressBar && progressText) {
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
    }
}

// Show theory content
function showTheory(section) {
    const theoryContent = document.querySelectorAll('.theory-content');
    theoryContent.forEach(content => {
        content.style.display = 'none';
    });

    const selectedContent = document.querySelector(`.theory-card:nth-child(${section}) .theory-content`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
}

// Run SQL query
function runQuery() {
    const sqlInput = document.getElementById('sql-input');
    const queryResult = document.getElementById('query-result');
    const query = sqlInput.value.trim();

    if (!query) {
        showNotification('Bitte geben Sie eine SQL-Abfrage ein.', 'error');
        return;
    }

    // Simulate query execution
    queryResult.innerHTML = '<p>Ausführung der Abfrage...</p>';

    // In a real application, this would connect to a database
    setTimeout(() => {
        queryResult.innerHTML = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>John Doe</td>
                    <td>john@example.com</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Jane Smith</td>
                    <td>jane@example.com</td>
                </tr>
            </table>
        `;
    }, 1000);
}

// Clear SQL editor
function clearEditor() {
    const sqlInput = document.getElementById('sql-input');
    const queryResult = document.getElementById('query-result');

    sqlInput.value = '';
    queryResult.innerHTML = '';
}

// Format SQL query
function formatSQL() {
    const sqlInput = document.getElementById('sql-input');
    const query = sqlInput.value.trim();

    // Basic SQL formatting
    let formatted = query
        .replace(/\s+/g, ' ')
        .replace(/\s*([,()])\s*/g, '$1 ')
        .replace(/\s*([=<>])\s*/g, ' $1 ')
        .replace(/\s*([+\-*/])\s*/g, ' $1 ');

    // Capitalize SQL keywords
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'TABLE', 'VALUES'];
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword);
    });

    sqlInput.value = formatted;
}

// Show hint for exercise
function showHint(exerciseId) {
    const hintContent = document.getElementById(`hint-${exerciseId}`);
    if (hintContent) {
        hintContent.style.display = hintContent.style.display === 'none' ? 'block' : 'none';
    }
}

// Quiz functionality
let currentQuestion = 1;
const totalQuestions = 5;
const questions = [
    {
        question: 'Was ist SQL?',
        options: [
            'Eine Programmiersprache',
            'Eine Datenbankabfragesprache',
            'Ein Betriebssystem',
            'Ein Netzwerkprotokoll'
        ],
        correct: 1
    },
    {
        question: 'Welche SQL-Anweisung wird zum Abrufen von Daten verwendet?',
        options: [
            'GET',
            'SELECT',
            'FETCH',
            'RETRIEVE'
        ],
        correct: 1
    },
    // Add more questions here
];

function checkAnswer(selectedOption) {
    const feedback = document.getElementById('quiz-feedback');
    const currentQ = questions[currentQuestion - 1];

    if (selectedOption === currentQ.correct) {
        feedback.className = 'quiz-feedback correct';
        feedback.textContent = 'Richtig!';
        updateProgress();
    } else {
        feedback.className = 'quiz-feedback incorrect';
        feedback.textContent = 'Falsch. Versuche es noch einmal!';
    }

    setTimeout(() => {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            loadQuestion();
        } else {
            showQuizComplete();
        }
    }, 1500);
}

function loadQuestion() {
    const currentQ = questions[currentQuestion - 1];
    const questionElement = document.getElementById('quiz-question');
    const optionsContainer = questionElement.querySelector('.quiz-options');
    const currentQuestionSpan = document.getElementById('current-question');
    const quizProgress = document.getElementById('quiz-progress');

    questionElement.querySelector('h3').textContent = currentQ.question;
    optionsContainer.innerHTML = '';

    currentQ.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });

    currentQuestionSpan.textContent = currentQuestion;
    quizProgress.style.width = `${(currentQuestion / totalQuestions) * 100}%`;
}

function showQuizComplete() {
    const quizContainer = document.querySelector('.quiz-container');
    const score = Math.round((currentQuestion / totalQuestions) * 100);

    quizContainer.innerHTML = `
        <h2>Quiz abgeschlossen!</h2>
        <p>Dein Ergebnis: ${score}%</p>
        <button onclick="restartQuiz()" class="quiz-btn">Quiz wiederholen</button>
    `;
}

function restartQuiz() {
    currentQuestion = 1;
    loadQuestion();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateProgress();
    loadQuestion();

    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}); 