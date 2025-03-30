// Globale Sprachfunktion
let currentLanguage = localStorage.getItem('preferredLanguage') || 'de';

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    updateLanguage();
}

function updateLanguage() {
    // Warte kurz, bis das DOM vollständig geladen ist
    setTimeout(() => {
        // Update all translatable elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (translations[currentLanguage] && translations[currentLanguage][key]) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translations[currentLanguage][key];
                } else {
                    element.textContent = translations[currentLanguage][key];
                }
            }
        });

        // Update language buttons
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === currentLanguage) {
                btn.classList.add('active');
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = currentLanguage;

        // Update page title if available
        const titleKey = document.querySelector('title')?.dataset.translate;
        if (titleKey && translations[currentLanguage] && translations[currentLanguage][titleKey]) {
            document.title = translations[currentLanguage][titleKey];
        }
    }, 50);
}

// Event Listener für Sprachbuttons
document.addEventListener('DOMContentLoaded', () => {
    // Setze initiale Sprache
    updateLanguage();

    // Füge Event Listener für Sprachbuttons hinzu
    document.querySelectorAll('.language-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = button.dataset.lang;
            changeLanguage(lang);
        });
    });
}); 