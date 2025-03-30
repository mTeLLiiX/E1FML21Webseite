document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    // Passwort-Überprüfung
    function validatePassword() {
        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity('Die Passwörter stimmen nicht überein');
        } else {
            confirmPassword.setCustomValidity('');
        }
    }

    password.addEventListener('change', validatePassword);
    confirmPassword.addEventListener('keyup', validatePassword);

    // Formular-Handling
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Hier würde normalerweise die API-Anfrage erfolgen
            // Für Demo-Zwecke simulieren wir eine erfolgreiche Registrierung
            const userData = {
                username,
                email,
                password: await hashPassword(password) // Passwort hashen
            };

            // Speichern der Benutzerdaten im localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));

            // Erfolgsmeldung anzeigen
            showMessage('Registrierung erfolgreich! Sie werden zur Login-Seite weitergeleitet.', 'success');
            
            // Nach 2 Sekunden zur Login-Seite weiterleiten
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            showMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
        }
    });
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
    
    const form = document.querySelector('.register-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Nachricht nach 3 Sekunden entfernen
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
} 