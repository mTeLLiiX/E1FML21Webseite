// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Update progress bar
function updateProgress() {
    const progress = localStorage.getItem('subnetting_progress') || 0;
    const progressBar = document.getElementById('subnetting-progress');
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

// Convert subnet mask to prefix length
function maskToPrefix(mask) {
    return mask.split('.').reduce((acc, octet) => {
        return acc + parseInt(octet).toString(2).split('1').length - 1;
    }, 0);
}

// Convert prefix length to subnet mask
function prefixToMask(prefix) {
    const binary = '1'.repeat(prefix) + '0'.repeat(32 - prefix);
    return binaryToIp(binary);
}

// Calculate network address
function calculateNetworkAddress(ip, mask) {
    const ipBinary = ipToBinary(ip);
    const maskBinary = ipToBinary(mask);
    const networkBinary = ipBinary.split('').map((bit, i) => {
        return bit === '1' && maskBinary[i] === '1' ? '1' : '0';
    }).join('');
    return binaryToIp(networkBinary);
}

// Calculate broadcast address
function calculateBroadcastAddress(ip, mask) {
    const ipBinary = ipToBinary(ip);
    const maskBinary = ipToBinary(mask);
    const broadcastBinary = ipBinary.split('').map((bit, i) => {
        return maskBinary[i] === '0' ? '1' : bit;
    }).join('');
    return binaryToIp(broadcastBinary);
}

// Calculate first usable host
function calculateFirstHost(networkAddress) {
    const octets = networkAddress.split('.');
    octets[3] = parseInt(octets[3]) + 1;
    return octets.join('.');
}

// Calculate last usable host
function calculateLastHost(broadcastAddress) {
    const octets = broadcastAddress.split('.');
    octets[3] = parseInt(octets[3]) - 1;
    return octets.join('.');
}

// Calculate total number of hosts
function calculateTotalHosts(mask) {
    const prefix = maskToPrefix(mask);
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

// Validate subnet mask
function validateSubnetMask(mask) {
    if (!validateIp(mask)) return false;

    const binary = ipToBinary(mask);
    const ones = binary.split('1').length - 1;
    const zeros = binary.split('0').length - 1;

    return ones + zeros === 32 && ones > 0 && zeros > 0;
}

// Calculate subnet
function calculateSubnet() {
    const ipAddress = document.getElementById('ip-address').value;
    const subnetMask = document.getElementById('subnet-mask').value;
    const hostsNeeded = parseInt(document.getElementById('hosts-needed').value);

    if (!validateIp(ipAddress)) {
        showNotification('Bitte geben Sie eine gültige IP-Adresse ein.', 'error');
        return;
    }

    if (!validateSubnetMask(subnetMask)) {
        showNotification('Bitte geben Sie eine gültige Subnetzmaske ein.', 'error');
        return;
    }

    if (isNaN(hostsNeeded) || hostsNeeded < 1) {
        showNotification('Bitte geben Sie eine gültige Anzahl von Hosts ein.', 'error');
        return;
    }

    const networkAddress = calculateNetworkAddress(ipAddress, subnetMask);
    const broadcastAddress = calculateBroadcastAddress(ipAddress, subnetMask);
    const firstHost = calculateFirstHost(networkAddress);
    const lastHost = calculateLastHost(broadcastAddress);
    const totalHosts = calculateTotalHosts(subnetMask);

    document.getElementById('network-id').textContent = networkAddress;
    document.getElementById('broadcast').textContent = broadcastAddress;
    document.getElementById('first-host').textContent = firstHost;
    document.getElementById('last-host').textContent = lastHost;
    document.getElementById('total-hosts').textContent = totalHosts;
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
        question: 'Was ist die Netzwerk-ID für 192.168.1.0/24?',
        options: [
            '192.168.1.1',
            '192.168.1.0',
            '192.168.1.255',
            '192.168.0.0'
        ],
        correct: 1
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
        question: 'Wie viele nutzbare Hosts hat ein /24 Netzwerk?',
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