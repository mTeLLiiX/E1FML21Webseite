// Profile Management
function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');

    // Load profile settings
    document.getElementById('username').value = profile.username || '';
    document.getElementById('email').value = profile.email || '';
    document.getElementById('language').value = profile.language || 'de';

    // Load avatar
    if (profile.avatar) {
        document.getElementById('user-avatar').src = profile.avatar;
    }

    // Load progress
    loadProgress();

    // Load achievements
    loadAchievements();

    // Load statistics
    loadStatistics();

    // Load learning history
    loadLearningHistory();
}

function saveProfile() {
    const profile = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        language: document.getElementById('language').value,
        avatar: document.getElementById('user-avatar').src
    };

    localStorage.setItem('user_profile', JSON.stringify(profile));
    showNotification('Profil erfolgreich gespeichert', 'success');
}

function changeAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('user-avatar').src = e.target.result;
                saveProfile();
            };
            reader.readAsDataURL(file);
        }
    };

    input.click();
}

// Progress Management
function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('learning_progress') || '{}');

    // Update progress bars
    updateProgressBar('sql', progress.sql || 0);
    updateProgressBar('subnetting', progress.subnetting || 0);
    updateProgressBar('binary', progress.binary || 0);
}

function updateProgressBar(topic, percentage) {
    const progressBar = document.getElementById(`${topic}-progress`);
    const percentageText = document.getElementById(`${topic}-percentage`);

    if (progressBar && percentageText) {
        progressBar.style.width = `${percentage}%`;
        percentageText.textContent = `${percentage}%`;
    }
}

// Achievement Management
function loadAchievements() {
    const achievements = JSON.parse(localStorage.getItem('achievements') || '{}');

    // Update achievement cards
    Object.entries(achievements).forEach(([id, achieved]) => {
        const card = document.querySelector(`[data-achievement="${id}"]`);
        if (card) {
            if (achieved) {
                card.classList.add('achieved');
            } else {
                card.classList.add('locked');
            }
        }
    });
}

// Statistics Management
function loadStatistics() {
    const stats = JSON.parse(localStorage.getItem('user_statistics') || '{}');

    // Update statistics display
    document.getElementById('total-learning-time').textContent =
        Math.round((stats.totalLearningTime || 0) / 60);
    document.getElementById('today-learning-time').textContent =
        stats.todayLearningTime || 0;
    document.getElementById('cards-learned').textContent =
        stats.cardsLearned || 0;
    document.getElementById('cards-success').textContent =
        `${stats.cardsSuccess || 0}%`;
    document.getElementById('games-played').textContent =
        stats.gamesPlayed || 0;
    document.getElementById('games-best').textContent =
        stats.gamesBest || '-';
    document.getElementById('calculations-done').textContent =
        stats.calculationsDone || 0;
    document.getElementById('calculations-accuracy').textContent =
        `${stats.calculationsAccuracy || 0}%`;
}

// Learning History Management
function loadLearningHistory() {
    const history = JSON.parse(localStorage.getItem('learning_history') || '[]');
    const historyList = document.getElementById('learning-history');

    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div>
                <strong>${item.topic}</strong>
                <p>${item.description}</p>
            </div>
            <span class="timestamp">${new Date(item.timestamp).toLocaleString()}</span>
        </div>
    `).join('');
}

// Language Management
function changeLanguage(lang) {
    localStorage.setItem('user_language', lang);
    updateLanguage(lang);
    showNotification('Sprache geändert', 'info');
}

function updateLanguage(lang) {
    const translations = window.translations[lang];
    if (!translations) return;

    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!localStorage.getItem('userLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // Load user data
    loadProfile();

    // Set up language
    const savedLanguage = localStorage.getItem('user_language') || 'de';
    updateLanguage(savedLanguage);

    // Set up event listeners
    document.getElementById('language').addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });

    // Set up dark mode
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', darkMode);

    // Set up avatar upload
    const avatarInput = document.createElement('input');
    avatarInput.type = 'file';
    avatarInput.accept = 'image/*';
    avatarInput.style.display = 'none';
    document.body.appendChild(avatarInput);
}); 