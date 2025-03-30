// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Update progress bar
function updateProgress() {
    const progress = localStorage.getItem('binary_progress') || 0;
    const progressBar = document.getElementById('binary-progress');
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

// Binär-Rechner Funktionalität

// DOM Elemente
const decimalInput = document.getElementById('decimal');
const binaryInput = document.getElementById('binary');
const resultDisplay = document.getElementById('result');

// Validierung für Binäreingabe
binaryInput.addEventListener('input', (e) => {
    const value = e.target.value;
    // Erlaube nur 0 und 1
    if (value && !/^[01]*$/.test(value)) {
        e.target.value = value.replace(/[^01]/g, '');
    }
});

// Dezimal zu Binär Konvertierung
function decimalToBinary() {
    const decimal = parseInt(decimalInput.value);
    
    if (isNaN(decimal)) {
        showError('Bitte geben Sie eine gültige Dezimalzahl ein');
        return;
    }

    if (decimal < 0) {
        showError('Bitte geben Sie eine positive Zahl ein');
        return;
    }

    let binary = decimal.toString(2);
    binaryInput.value = binary;
    resultDisplay.textContent = binary;
    
    // Animation
    animateResult('Dezimal zu Binär konvertiert');
}

// Binär zu Dezimal Konvertierung
function binaryToDecimal() {
    const binary = binaryInput.value;
    
    if (!binary) {
        showError('Bitte geben Sie eine Binärzahl ein');
        return;
    }

    if (!/^[01]+$/.test(binary)) {
        showError('Binärzahlen dürfen nur 0 und 1 enthalten');
        return;
    }

    const decimal = parseInt(binary, 2);
    decimalInput.value = decimal;
    resultDisplay.textContent = decimal;
    
    // Animation
    animateResult('Binär zu Dezimal konvertiert');
}

// Fehleranzeige
function showError(message) {
    resultDisplay.textContent = message;
    resultDisplay.style.color = 'var(--error-color)';
    
    // GSAP Animation für Fehler
    gsap.to(resultDisplay, {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
    });

    // Nach 3 Sekunden zurücksetzen
    setTimeout(() => {
        resultDisplay.textContent = '-';
        resultDisplay.style.color = 'var(--text-color)';
    }, 3000);
}

// Ergebnisanimation
function animateResult(message) {
    // GSAP Animation für das Ergebnis
    gsap.from(resultDisplay, {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
    });

    // Tooltip mit der Nachricht
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;
    resultDisplay.appendChild(tooltip);

    // Tooltip Animation
    gsap.from(tooltip, {
        y: 10,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
    });

    // Tooltip nach 2 Sekunden entfernen
    setTimeout(() => {
        gsap.to(tooltip, {
            y: 10,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => tooltip.remove()
        });
    }, 2000);
}

// Event Listener für Enter-Taste
decimalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        decimalToBinary();
    }
});

binaryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        binaryToDecimal();
    }
});

// Tooltip Styles
const style = document.createElement('style');
style.textContent = `
    .tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.8rem;
        white-space: nowrap;
        pointer-events: none;
        margin-bottom: 0.5rem;
    }
`;
document.head.appendChild(style);

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
        question: 'Was ist die Dezimalzahl für die Binärzahl 1010?',
        options: [
            '8',
            '10',
            '12',
            '14'
        ],
        correct: 1
    },
    {
        question: 'Was ist die Binärzahl für die Dezimalzahl 42?',
        options: [
            '101010',
            '110010',
            '100110',
            '111000'
        ],
        correct: 0
    },
    {
        question: 'Wie viele Bits hat ein Byte?',
        options: [
            '4',
            '6',
            '8',
            '10'
        ],
        correct: 2
    },
    {
        question: 'Was ist das Ergebnis der binären Addition: 1010 + 0101?',
        options: [
            '1110',
            '1111',
            '10011',
            '10111'
        ],
        correct: 1
    },
    {
        question: 'Was ist das Ergebnis der binären Subtraktion: 1100 - 0110?',
        options: [
            '0100',
            '0110',
            '1000',
            '1010'
        ],
        correct: 1
    }
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