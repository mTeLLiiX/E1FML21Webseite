// Language handling
function changeLanguage(lang) {
    // Update all language-specific elements
    document.querySelectorAll('[data-lang]').forEach(element => {
        if (element.getAttribute('data-lang') === lang) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });

    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.querySelector(`img[alt="${lang}"]`)) {
            btn.classList.add('active');
        }
    });

    // Update page title
    const title = document.querySelector(`title[data-lang="${lang}"]`);
    if (title) {
        document.title = title.textContent;
    }

    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Quiz functionality
function checkAnswer(answer) {
    const feedback = document.querySelector('.quiz-feedback');
    const correctAnswer = 1; // HyperText Markup Language

    if (answer === correctAnswer) {
        feedback.textContent = getFeedbackMessage('correct', currentLanguage);
        feedback.className = 'quiz-feedback correct';
    } else {
        feedback.textContent = getFeedbackMessage('incorrect', currentLanguage);
        feedback.className = 'quiz-feedback incorrect';
    }
}

function getFeedbackMessage(type, lang) {
    const messages = {
        correct: {
            de: 'Richtig! HTML steht für HyperText Markup Language.',
            en: 'Correct! HTML stands for HyperText Markup Language.',
            ru: 'Правильно! HTML означает HyperText Markup Language.',
            so: 'Sax ah! HTML waxay ka kooban tahay HyperText Markup Language.'
        },
        incorrect: {
            de: 'Leider falsch. Versuche es noch einmal!',
            en: 'Sorry, that\'s incorrect. Try again!',
            ru: 'К сожалению, неправильно. Попробуйте еще раз!',
            so: 'Waan ka xumahay. Isku day mar kale!'
        }
    };

    return messages[type][lang];
}

// Code editor functionality
function runCode() {
    const editor = document.getElementById('html-editor');
    const preview = document.getElementById('preview-frame');
    const code = editor.value;

    // Create a new document in the iframe
    const doc = preview.contentDocument || preview.contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();

    // Save code to localStorage
    localStorage.setItem('htmlEditorCode', code);
}

// CSS Playground functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize color pickers
    const bgColor = document.getElementById('bg-color');
    const textColor = document.getElementById('text-color');
    const preview = document.getElementById('style-preview');

    // Load saved colors
    const savedBgColor = localStorage.getItem('playgroundBgColor') || '#ffffff';
    const savedTextColor = localStorage.getItem('playgroundTextColor') || '#000000';

    bgColor.value = savedBgColor;
    textColor.value = savedTextColor;
    preview.style.backgroundColor = savedBgColor;
    preview.style.color = savedTextColor;

    // Add event listeners
    bgColor.addEventListener('input', function() {
        preview.style.backgroundColor = this.value;
        localStorage.setItem('playgroundBgColor', this.value);
    });

    textColor.addEventListener('input', function() {
        preview.style.color = this.value;
        localStorage.setItem('playgroundTextColor', this.value);
    });

    // Load saved code
    const savedCode = localStorage.getItem('htmlEditorCode');
    if (savedCode) {
        document.getElementById('html-editor').value = savedCode;
        runCode();
    }

    // Load preferred language
    const preferredLang = localStorage.getItem('preferredLanguage') || 'de';
    changeLanguage(preferredLang);
});

// Smooth scrolling for navigation links
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

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save code
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        runCode();
    }
}); 