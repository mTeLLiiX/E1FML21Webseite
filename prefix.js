// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Update progress bar
function updateProgress() {
    const progress = localStorage.getItem('prefix_progress') || 0;
    const progressBar = document.getElementById('prefix-progress');
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

// Convert IP address to binary
function ipToBinary(ip) {
    return ip.split('.').map(octet => {
        return parseInt(octet).toString(2).padStart(8, '0');
    }).join('');
}

// Convert binary to IP address
function binaryToIp(binary) {
    const octets = [];
    for (let i = 0; i < 32; i += 8) {
        octets.push(parseInt(binary.substr(i, 8), 2));
    }
    return octets.join('.');
}

// Calculate network address
function calculateNetworkAddress(ip, prefix) {
    const binary = ipToBinary(ip);
    const networkBinary = binary.substr(0, prefix).padEnd(32, '0');
    return binaryToIp(networkBinary);
}

// Calculate broadcast address
function calculateBroadcastAddress(ip, prefix) {
    const binary = ipToBinary(ip);
    const broadcastBinary = binary.substr(0, prefix).padEnd(32, '1');
    return binaryToIp(broadcastBinary);
}

// Calculate first usable IP
function calculateFirstUsableIp(networkAddress) {
    const octets = networkAddress.split('.');
    octets[3] = parseInt(octets[3]) + 1;
    return octets.join('.');
}

// Calculate last usable IP
function calculateLastUsableIp(broadcastAddress) {
    const octets = broadcastAddress.split('.');
    octets[3] = parseInt(octets[3]) - 1;
    return octets.join('.');
}

// Calculate number of usable IPs
function calculateUsableIps(prefix) {
    return Math.pow(2, 32 - prefix) - 2;
}

// Validate IP address
function validateIp(ip) {
    const octets = ip.split('.');
    if (octets.length !== 4) return false;

    return octets.every(octet => {
        const num = parseInt(octet);
        return num >= 0 && num <= 255;
    });
}

// Calculate prefix
function calculatePrefix() {
    const ipInput = document.getElementById('ip-input');
    const prefixInput = document.getElementById('prefix-input');
    const ip = ipInput.value;
    const prefix = parseInt(prefixInput.value);

    if (!validateIp(ip)) {
        showNotification('Bitte geben Sie eine gültige IP-Adresse ein.', 'error');
        return;
    }

    if (isNaN(prefix) || prefix < 0 || prefix > 32) {
        showNotification('Bitte geben Sie eine gültige Präfixlänge ein (0-32).', 'error');
        return;
    }

    const networkAddress = calculateNetworkAddress(ip, prefix);
    const broadcastAddress = calculateBroadcastAddress(ip, prefix);
    const firstUsableIp = calculateFirstUsableIp(networkAddress);
    const lastUsableIp = calculateLastUsableIp(broadcastAddress);
    const usableIps = calculateUsableIps(prefix);

    document.getElementById('network-address').textContent = networkAddress;
    document.getElementById('broadcast-address').textContent = broadcastAddress;
    document.getElementById('first-ip').textContent = firstUsableIp;
    document.getElementById('last-ip').textContent = lastUsableIp;
    document.getElementById('usable-ips').textContent = usableIps;
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
        question: 'Was ist die Netzwerkadresse für 192.168.1.100/24?',
        options: [
            '192.168.1.0',
            '192.168.1.1',
            '192.168.1.255',
            '192.168.0.0'
        ],
        correct: 0
    },
    {
        question: 'Was ist die Broadcast-Adresse für 10.0.0.0/8?',
        options: [
            '10.0.0.255',
            '10.255.255.255',
            '10.0.255.255',
            '10.255.0.0'
        ],
        correct: 1
    },
    {
        question: 'Wie viele nutzbare IPs hat ein /24 Netzwerk?',
        options: [
            '254',
            '255',
            '256',
            '257'
        ],
        correct: 0
    },
    {
        question: 'Was ist die erste nutzbare IP im Netzwerk 172.16.0.0/16?',
        options: [
            '172.16.0.0',
            '172.16.0.1',
            '172.16.1.0',
            '172.16.1.1'
        ],
        correct: 1
    },
    {
        question: 'Was ist die letzte nutzbare IP im Netzwerk 192.168.1.0/24?',
        options: [
            '192.168.1.254',
            '192.168.1.255',
            '192.168.1.256',
            '192.168.1.257'
        ],
        correct: 0
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