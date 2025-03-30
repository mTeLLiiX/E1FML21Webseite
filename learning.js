// Learning State
const learningState = {
    currentLanguage: 'de',
    progress: 0,
    completedSections: new Set()
};

// Initialize Learning Page
function initLearning() {
    setupEventListeners();
    loadProgress();
    updateLanguage('de');
}

// Setup Event Listeners
function setupEventListeners() {
    // Language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
            updateLanguage(lang);
        });
    });

    // Progress tracking
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                if (!learningState.completedSections.has(section.id)) {
                    learningState.completedSections.add(section.id);
                    updateProgress();
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.content-section').forEach(section => {
        observer.observe(section);
    });
}

// Update Language
function updateLanguage(lang) {
    learningState.currentLanguage = lang;
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(lang)) {
            btn.classList.add('active');
        }
    });

    // Update content visibility
    document.querySelectorAll('[data-lang]').forEach(element => {
        element.classList.remove('active');
        if (element.getAttribute('data-lang') === lang) {
            element.classList.add('active');
        }
    });
}

// Load Progress
function loadProgress() {
    const savedProgress = localStorage.getItem('learningProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        learningState.progress = progress.progress;
        learningState.completedSections = new Set(progress.completedSections);
        updateProgressBar();
    }
}

// Update Progress
function updateProgress() {
    const totalSections = document.querySelectorAll('.content-section').length;
    const completedCount = learningState.completedSections.size;
    learningState.progress = Math.round((completedCount / totalSections) * 100);
    
    updateProgressBar();
    saveProgress();
}

// Update Progress Bar
function updateProgressBar() {
    const progressBar = document.getElementById('learning-progress');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${learningState.progress}%`;
        progressText.textContent = `${learningState.progress}%`;
    }
}

// Save Progress
function saveProgress() {
    const progress = {
        progress: learningState.progress,
        completedSections: Array.from(learningState.completedSections)
    };
    localStorage.setItem('learningProgress', JSON.stringify(progress));
}

// Binary Calculator Functions
function convertToBinary() {
    const decimalInput = document.getElementById('decimal-input');
    const result = document.getElementById('binary-result');
    
    if (decimalInput && result) {
        const decimal = parseInt(decimalInput.value);
        if (!isNaN(decimal)) {
            const binary = decimal.toString(2);
            result.textContent = `${decimal} (Dezimal) = ${binary} (Binär)`;
        } else {
            result.textContent = 'Bitte geben Sie eine gültige Dezimalzahl ein.';
        }
    }
}

function addBinary() {
    const binary1 = document.getElementById('binary1');
    const binary2 = document.getElementById('binary2');
    const result = document.getElementById('addition-result');
    
    if (binary1 && binary2 && result) {
        const num1 = parseInt(binary1.value, 2);
        const num2 = parseInt(binary2.value, 2);
        
        if (!isNaN(num1) && !isNaN(num2)) {
            const sum = num1 + num2;
            const binarySum = sum.toString(2);
            result.textContent = `${binary1.value} + ${binary2.value} = ${binarySum}`;
        } else {
            result.textContent = 'Bitte geben Sie gültige Binärzahlen ein.';
        }
    }
}

function convertToASCII() {
    const input = document.getElementById('ascii-input');
    const result = document.getElementById('ascii-result');
    
    if (input && result) {
        const text = input.value;
        const ascii = Array.from(text).map(char => char.charCodeAt(0));
        const binary = ascii.map(code => code.toString(2).padStart(8, '0'));
        
        result.innerHTML = `
            <p>ASCII-Codes:</p>
            <p>${ascii.join(', ')}</p>
            <p>Binär:</p>
            <p>${binary.join(' ')}</p>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initLearning); 