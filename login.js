// Login State
const loginState = {
    users: [],
    currentUser: null
};

// GSAP Animationen für Login-Formular
const loginForm = document.getElementById('loginForm');
const loginContainer = document.querySelector('.login-container');

// Login-Formular anzeigen
function showLoginForm() {
    loginContainer.classList.add('active');
    gsap.from('.login-content', {
        duration: 0.5,
        scale: 0.8,
        opacity: 0,
        ease: 'power3.out'
    });
}

// Login-Formular ausblenden
function hideLoginForm() {
    gsap.to('.login-content', {
        duration: 0.3,
        scale: 0.8,
        opacity: 0,
        ease: 'power2.in',
        onComplete: () => {
            loginContainer.classList.remove('active');
        }
    });
}

// Initialize Login Page
function initLoginPage() {
    loadUsers();
    setupEventListeners();
}

// Load Users from localStorage
function loadUsers() {
    const users = localStorage.getItem('users');
    if (users) {
        loginState.users = JSON.parse(users);
    }
}

// Save Users to localStorage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(loginState.users));
}

// Setup Event Listeners
function setupEventListeners() {
    // Login Form
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Show Register Modal
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', () => {
            const modal = document.getElementById('registerModal');
            if (modal) {
                modal.style.display = 'block';
            }
        });
    }

    // Close Register Modal
    const closeRegisterBtn = document.getElementById('closeRegisterBtn');
    if (closeRegisterBtn) {
        closeRegisterBtn.addEventListener('click', () => {
            const modal = document.getElementById('registerModal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Close Modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('registerModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Check for admin login
    if (username === 'admin' && password === 'admin123') {
        const adminUser = {
            username: 'admin',
            role: 'admin',
            email: 'admin@example.com'
        };
        loginState.currentUser = adminUser;
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        if (rememberMe) {
            localStorage.setItem('rememberedUser', JSON.stringify({ username, password }));
        }
        window.location.href = 'dashboard.html';
        return;
    }

    // Check for user login
    const user = loginState.users.find(u => u.username === username && u.password === hashPassword(password));
    if (user) {
        loginState.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (rememberMe) {
            localStorage.setItem('rememberedUser', JSON.stringify({ username, password }));
        }
        window.location.href = 'dashboard.html';
        return;
    }

    showNotification('Ungültige Anmeldedaten', 'error');
}

// Handle Register
function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
        showNotification('Bitte füllen Sie alle Felder aus', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Die Passwörter stimmen nicht überein', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Das Passwort muss mindestens 6 Zeichen lang sein', 'error');
        return;
    }

    // Check if username or email already exists
    if (loginState.users.some(u => u.username === username || u.email === email)) {
        showNotification('Benutzername oder E-Mail-Adresse existiert bereits', 'error');
        return;
    }

    // Create new user
    const newUser = {
        username,
        email,
        password: hashPassword(password),
        role: 'user'
    };

    loginState.users.push(newUser);
    saveUsers();
    loginState.currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // Close modal and redirect
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.style.display = 'none';
    }
    showNotification('Registrierung erfolgreich!', 'success');
    window.location.href = 'dashboard.html';
}

// Show Notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Hash Password
function hashPassword(password) {
    return btoa(password); // Simple base64 encoding for demo purposes
}

// Validate Email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Parallax-Effekt für Hero-Sektion
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    
    gsap.to(hero, {
        y: scrolled * 0.5,
        duration: 0.1
    });
});

// Hover-Effekte für Karten
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Navbar-Animation
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
        // Scroll nach unten
        nav.classList.remove('scroll-up');
        nav.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
        // Scroll nach oben
        nav.classList.remove('scroll-down');
        nav.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Sprachauswahl-Animation
const langButtons = document.querySelectorAll('.lang-btn');
langButtons.forEach(button => {
    button.addEventListener('click', () => {
        gsap.to(button, {
            scale: 1.2,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });
        
        // Aktive Klasse aktualisieren
        langButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// Initialisierung der Animationen beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    // Hero-Content Animation
    gsap.from('.hero-content', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });

    // Features-Animation
    gsap.from('.card', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out'
    });
});

// Initialize Login Page when DOM is loaded
document.addEventListener('DOMContentLoaded', initLoginPage);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usernameValue = username.value;
        const passwordValue = password.value;

        try {
            // Benutzer aus dem localStorage laden
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === usernameValue);

            if (!user) {
                showMessage('Benutzername oder Passwort falsch', 'error');
                return;
            }

            // Passwort überprüfen
            const hashedPassword = await hashPassword(passwordValue);
            if (user.password !== hashedPassword) {
                showMessage('Benutzername oder Passwort falsch', 'error');
                return;
            }

            // Login erfolgreich
            const userData = {
                username: user.username,
                email: user.email
            };
            
            // Speichere den eingeloggten Benutzer
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // Wenn "Angemeldet bleiben" aktiviert ist
            const rememberMe = document.getElementById('rememberMe').checked;
            if (rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify(userData));
            }

            showMessage('Login erfolgreich! Sie werden zum Dashboard weitergeleitet.', 'success');
            
            // Nach 2 Sekunden zum Dashboard weiterleiten
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);

        } catch (error) {
            showMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
        }
    });

    // Prüfe auf gespeicherten Benutzer
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        const userData = JSON.parse(rememberedUser);
        username.value = userData.username;
        document.getElementById('rememberMe').checked = true;
    }
});

// Hilfsfunktion zum Hashen des Passworts
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Hilfsfunktion zum Anzeigen von Nachrichten
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.querySelector('.login-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Nachricht nach 3 Sekunden entfernen
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
} 