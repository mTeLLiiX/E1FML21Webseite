// User credentials (in a real application, this would be handled server-side)
const validCredentials = {
    username: 'admin',
    password: 'admin123'
};

// Benutzer-Verwaltung
let users = JSON.parse(localStorage.getItem('users')) || {
    'admin': {
        password: 'admin123',
        username: 'admin'
    }
};

// Check if user is already logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (isLoggedIn && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
}

// Anmeldung
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const loginForm = document.querySelector('.login-form');

    if (users[username] && users[username].password === password) {
        // Erfolgreiche Anmeldung Animation
        loginForm.style.transform = 'scale(0.95)';
        setTimeout(() => {
            loginForm.style.transform = 'scale(1)';
        }, 200);

        localStorage.setItem('currentUser', JSON.stringify(users[username]));
        localStorage.setItem('userLoggedIn', 'true');
        showNotification(translations[getCurrentLanguage()].successLogin, 'success');
        
        // Sanftes Ausblenden des Modals
        const loginModal = document.querySelector('.login-modal');
        loginModal.style.opacity = '0';
        setTimeout(() => {
            hideLoginModal();
        }, 300);
        
        // Weiterleitung nach erfolgreicher Anmeldung
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        // Fehlgeschlagene Anmeldung Animation
        loginForm.style.transform = 'translateX(-10px)';
        setTimeout(() => {
            loginForm.style.transform = 'translateX(10px)';
            setTimeout(() => {
                loginForm.style.transform = 'translateX(0)';
            }, 100);
        }, 100);

        errorMessage.textContent = translations[getCurrentLanguage()].invalidCredentials;
        errorMessage.style.display = 'block';
        showNotification(translations[getCurrentLanguage()].invalidCredentials, 'error');
    }
}

// Registrierung
function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorMessage = document.getElementById('register-error-message');
    const registerForm = document.querySelector('.register-form');

    if (password !== confirmPassword) {
        // Fehlermeldung Animation
        registerForm.style.transform = 'translateX(-10px)';
        setTimeout(() => {
            registerForm.style.transform = 'translateX(10px)';
            setTimeout(() => {
                registerForm.style.transform = 'translateX(0)';
            }, 100);
        }, 100);

        errorMessage.textContent = translations[getCurrentLanguage()].passwordMismatch;
        errorMessage.style.display = 'block';
        showNotification(translations[getCurrentLanguage()].passwordMismatch, 'error');
        return;
    }

    if (users[username]) {
        // Fehlermeldung Animation
        registerForm.style.transform = 'translateX(-10px)';
        setTimeout(() => {
            registerForm.style.transform = 'translateX(10px)';
            setTimeout(() => {
                registerForm.style.transform = 'translateX(0)';
            }, 100);
        }, 100);

        errorMessage.textContent = translations[getCurrentLanguage()].usernameExists;
        errorMessage.style.display = 'block';
        showNotification(translations[getCurrentLanguage()].usernameExists, 'error');
        return;
    }

    try {
        // Erfolgreiche Registrierung Animation
        registerForm.style.transform = 'scale(0.95)';
        setTimeout(() => {
            registerForm.style.transform = 'scale(1)';
        }, 200);

        users[username] = {
            username: username,
            password: password
        };
        localStorage.setItem('users', JSON.stringify(users));
        showNotification(translations[getCurrentLanguage()].registrationSuccess, 'success');
        
        // Sanftes Ausblenden des Registrierungsmodals
        const registerModal = document.querySelector('.register-modal');
        registerModal.style.opacity = '0';
        setTimeout(() => {
            hideRegisterModal();
            // Sanftes Einblenden des Login-Modals
            setTimeout(() => {
                showLoginModal();
            }, 300);
        }, 300);
    } catch (error) {
        // Fehlermeldung Animation
        registerForm.style.transform = 'translateX(-10px)';
        setTimeout(() => {
            registerForm.style.transform = 'translateX(10px)';
            setTimeout(() => {
                registerForm.style.transform = 'translateX(0)';
            }, 100);
        }, 100);

        errorMessage.textContent = translations[getCurrentLanguage()].registrationError;
        errorMessage.style.display = 'block';
        showNotification(translations[getCurrentLanguage()].registrationError, 'error');
    }
}

// Hilfsfunktionen
function getCurrentLanguage() {
    return localStorage.getItem('preferredLanguage') || 'de';
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Logout function
function logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

// Check login status when page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    
    .notification.success {
        background-color: #2ecc71;
    }
    
    .notification.error {
        background-color: #e74c3c;
    }
    
    .notification.info {
        background-color: #3498db;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 

// Partikel-Effekte
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particlesContainer.appendChild(particle);
    }
}

// Login Modal
function showLoginModal() {
    const loginModal = document.querySelector('.login-modal');
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Verzögerung für die Animation
    setTimeout(() => {
        loginModal.style.opacity = '1';
        loginModal.querySelector('.login-modal-content').style.transform = 'translateY(0)';
    }, 10);
}

function hideLoginModal() {
    const loginModal = document.querySelector('.login-modal');
    loginModal.style.opacity = '0';
    loginModal.querySelector('.login-modal-content').style.transform = 'translateY(-20px)';
    
    // Warte auf die Animation, bevor das Modal ausgeblendet wird
    setTimeout(() => {
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('error-message').style.display = 'none';
    }, 300);
}

function showRegisterModal() {
    const registerModal = document.querySelector('.register-modal');
    registerModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Verzögerung für die Animation
    setTimeout(() => {
        registerModal.style.opacity = '1';
        registerModal.querySelector('.register-modal-content').style.transform = 'translateY(0)';
    }, 10);
}

function hideRegisterModal() {
    const registerModal = document.querySelector('.register-modal');
    registerModal.style.opacity = '0';
    registerModal.querySelector('.register-modal-content').style.transform = 'translateY(-20px)';
    
    // Warte auf die Animation, bevor das Modal ausgeblendet wird
    setTimeout(() => {
        registerModal.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('register-error-message').style.display = 'none';
    }, 300);
}

// GSAP Animationen
gsap.from('.hero h1', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
});

gsap.from('.hero p', {
    duration: 1,
    y: 30,
    opacity: 0,
    delay: 0.5,
    ease: 'power3.out'
});

gsap.from('.hero-buttons', {
    duration: 1,
    y: 30,
    opacity: 0,
    delay: 1,
    ease: 'power3.out'
});

gsap.from('.features .card', {
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.features',
        start: 'top center+=100'
    }
});

// Event Listener
document.addEventListener('DOMContentLoaded', () => {
    createParticles();

    // Login Form
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register Form
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Modal Buttons
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const closeLoginBtn = document.querySelector('.login-modal .close-modal');
    const closeRegisterBtn = document.querySelector('.register-modal .close-modal');
    const switchToRegisterBtn = document.querySelector('.switch-to-register');
    const switchToLoginBtn = document.querySelector('.switch-to-login');

    if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
    if (registerBtn) registerBtn.addEventListener('click', showRegisterModal);
    if (closeLoginBtn) closeLoginBtn.addEventListener('click', hideLoginModal);
    if (closeRegisterBtn) closeRegisterBtn.addEventListener('click', hideRegisterModal);
    if (switchToRegisterBtn) switchToRegisterBtn.addEventListener('click', () => {
        hideLoginModal();
        setTimeout(showRegisterModal, 300);
    });
    if (switchToLoginBtn) switchToLoginBtn.addEventListener('click', () => {
        hideRegisterModal();
        setTimeout(showLoginModal, 300);
    });

    // Modal Click Outside
    const loginModal = document.querySelector('.login-modal');
    const registerModal = document.querySelector('.register-modal');

    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                hideLoginModal();
            }
        });
    }

    if (registerModal) {
        registerModal.addEventListener('click', (e) => {
            if (e.target === registerModal) {
                hideRegisterModal();
            }
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Code Editor initialisieren
    initializeCodeEditor();
});

// Code Editor Funktionalität
function initializeCodeEditor() {
    const editor = document.querySelector('.code-editor-content');
    const runButton = document.querySelector('.code-editor-actions .fa-play').parentElement;
    const saveButton = document.querySelector('.code-editor-actions .fa-save').parentElement;
    
    // Syntax Highlighting
    function highlightSyntax(code) {
        return code
            .replace(/(\/\/.*)/g, '<span class="comment">$1</span>')
            .replace(/\b(function|return|console|log)\b/g, '<span class="keyword">$1</span>')
            .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
            .replace(/([{}()])/g, '<span class="bracket">$1</span>');
    }
    
    // Code ausführen
    runButton.addEventListener('click', () => {
        const code = editor.textContent;
        try {
            const result = eval(code);
            showNotification(translations[getCurrentLanguage()].runCode, 'success');
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });
    
    // Code speichern
    saveButton.addEventListener('click', () => {
        const code = editor.textContent;
        localStorage.setItem('savedCode', code);
        showNotification(translations[getCurrentLanguage()].saveCode, 'success');
    });
    
    // Auto-Vervollständigung
    let suggestions = [
        'function', 'return', 'console', 'log', 'if', 'else', 'for', 'while',
        'const', 'let', 'var', 'true', 'false', 'null', 'undefined'
    ];
    
    editor.addEventListener('input', (e) => {
        const code = e.target.textContent;
        const lines = code.split('\n');
        const currentLine = lines[lines.length - 1];
        const words = currentLine.split(' ');
        const currentWord = words[words.length - 1];
        
        if (currentWord.length > 0) {
            const matches = suggestions.filter(word => 
                word.startsWith(currentWord)
            );
            
            if (matches.length > 0) {
                // Hier könnte die Auto-Vervollständigung implementiert werden
                // z.B. mit einem Dropdown-Menü
            }
        }
    });
    
    // Zeilennummern
    function updateLineNumbers() {
        const lines = editor.textContent.split('\n').length;
        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'line-numbers';
        
        for (let i = 1; i <= lines; i++) {
            const lineNumber = document.createElement('div');
            lineNumber.textContent = i;
            lineNumbers.appendChild(lineNumber);
        }
        
        const existingLineNumbers = editor.parentElement.querySelector('.line-numbers');
        if (existingLineNumbers) {
            existingLineNumbers.remove();
        }
        
        editor.parentElement.insertBefore(lineNumbers, editor);
    }
    
    editor.addEventListener('input', updateLineNumbers);
    updateLineNumbers();
}

// Karteikarten-Verwaltung
let cards = [];
let currentCardIndex = 0;
let statistics = {
    total: 0,
    understood: 0,
    notUnderstood: 0
};

// DOM-Elemente
const flashcard = document.querySelector('.flashcard');
const question = document.getElementById('question');
const answer = document.getElementById('answer');
const showAnswerBtn = document.getElementById('show-answer');
const feedbackButtons = document.querySelector('.feedback-buttons');
const understoodBtn = document.getElementById('understood');
const notUnderstoodBtn = document.getElementById('not-understood');
const newQuestionInput = document.getElementById('new-question');
const newAnswerInput = document.getElementById('new-answer');
const saveCardBtn = document.getElementById('save-card');

// Statistik-Elemente
const totalCardsElement = document.getElementById('total-cards');
const correctCardsElement = document.getElementById('correct-cards');
const incorrectCardsElement = document.getElementById('incorrect-cards');

// Event Listeners
showAnswerBtn.addEventListener('click', flipCard);
understoodBtn.addEventListener('click', () => markCard('understood'));
notUnderstoodBtn.addEventListener('click', () => markCard('notUnderstood'));
saveCardBtn.addEventListener('click', saveNewCard);
flashcard.addEventListener('click', flipCard);

// Lade gespeicherte Karten und Statistiken
loadFromLocalStorage();

// Funktionen
function flipCard() {
    flashcard.classList.toggle('flipped');
    if (flashcard.classList.contains('flipped')) {
        showAnswerBtn.style.display = 'none';
        feedbackButtons.style.display = 'block';
    } else {
        showAnswerBtn.style.display = 'block';
        feedbackButtons.style.display = 'none';
    }
}

function markCard(status) {
    if (status === 'understood') {
        statistics.understood++;
    } else {
        statistics.notUnderstood++;
    }
    updateStatistics();
    saveToLocalStorage();
    showNextCard();
}

function showNextCard() {
    if (cards.length === 0) {
        question.textContent = 'Keine Karten verfügbar';
        answer.textContent = 'Erstellen Sie neue Karten';
        return;
    }

    currentCardIndex = (currentCardIndex + 1) % cards.length;
    showCard(currentCardIndex);
}

function showCard(index) {
    flashcard.classList.remove('flipped');
    showAnswerBtn.style.display = 'block';
    feedbackButtons.style.display = 'none';
    
    question.textContent = cards[index].question;
    answer.textContent = cards[index].answer;
}

function saveNewCard() {
    const newQuestion = newQuestionInput.value.trim();
    const newAnswer = newAnswerInput.value.trim();

    if (newQuestion && newAnswer) {
        const newCard = {
            question: newQuestion,
            answer: newAnswer,
            status: 'new'
        };

        cards.push(newCard);
        statistics.total++;
        updateStatistics();
        saveToLocalStorage();

        // Formular zurücksetzen
        newQuestionInput.value = '';
        newAnswerInput.value = '';

        // Zeige die neue Karte an, wenn es die erste ist
        if (cards.length === 1) {
            showCard(0);
        }
    }
}

function updateStatistics() {
    totalCardsElement.textContent = statistics.total;
    correctCardsElement.textContent = statistics.understood;
    incorrectCardsElement.textContent = statistics.notUnderstood;
}

function saveToLocalStorage() {
    localStorage.setItem('flashcards', JSON.stringify(cards));
    localStorage.setItem('flashcardStats', JSON.stringify(statistics));
}

function loadFromLocalStorage() {
    const savedCards = localStorage.getItem('flashcards');
    const savedStats = localStorage.getItem('flashcardStats');

    if (savedCards) {
        cards = JSON.parse(savedCards);
        if (cards.length > 0) {
            showCard(0);
        }
    }

    if (savedStats) {
        statistics = JSON.parse(savedStats);
        updateStatistics();
    }
} 