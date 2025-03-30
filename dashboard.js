// Dashboard State
const dashboardState = {
    user: null,
    progress: {
        sql: 0,
        subnetting: 0,
        binary: 0
    },
    recentActivity: [],
    stats: {
        learningTime: 0,
        flashcardsLearned: 0,
        gamesPlayed: 0,
        toolsUsed: 0
    },
    searchResults: []
};

// Current language state
let currentLanguage = 'de';

// Initialize Dashboard
function initDashboard() {
    checkAuth();
    loadUserData();
    loadProgress();
    loadRecentActivity();
    loadStats();
    setupEventListeners();
    initDarkMode();
    const preferredLang = localStorage.getItem('preferredLanguage') || 'de';
    changeLanguage(preferredLang);
}

// Check Authentication
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    dashboardState.user = JSON.parse(user);
}

// Load User Data
function loadUserData() {
    const username = document.getElementById('username');
    if (username) {
        username.textContent = dashboardState.user.username;
    }
}

// Load Progress
function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('progress')) || {};
    dashboardState.progress = { ...dashboardState.progress, ...progress };

    // Update progress bars
    Object.entries(dashboardState.progress).forEach(([area, value]) => {
        const progressBar = document.querySelector(`#${area}-progress .progress`);
        if (progressBar) {
            progressBar.style.width = `${value}%`;
        }
    });
}

// Load Recent Activity
function loadRecentActivity() {
    const activity = JSON.parse(localStorage.getItem('activity')) || [];
    dashboardState.recentActivity = activity.slice(0, 5); // Get last 5 activities

    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = dashboardState.recentActivity.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${getActivityIcon(activity.type)}</div>
                <div class="activity-info">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
            </div>
        `).join('');
    }
}

// Load Stats
function loadStats() {
    const stats = JSON.parse(localStorage.getItem('stats')) || {};
    dashboardState.stats = { ...dashboardState.stats, ...stats };

    // Update stats display
    Object.entries(dashboardState.stats).forEach(([stat, value]) => {
        const statElement = document.querySelector(`#${stat}-value`);
        if (statElement) {
            statElement.textContent = formatStatValue(stat, value);
        }
    });
}

// Get Activity Icon
function getActivityIcon(type) {
    const icons = {
        flashcard: '📝',
        game: '🎮',
        tool: '🛠️',
        quiz: '📊',
        achievement: '🏆'
    };
    return icons[type] || '📌';
}

// Format Stat Value
function formatStatValue(stat, value) {
    switch (stat) {
        case 'learningTime':
            return `${Math.floor(value / 60)}h ${value % 60}m`;
        case 'flashcardsLearned':
        case 'gamesPlayed':
        case 'toolsUsed':
            return value.toString();
        default:
            return value.toString();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // Logout Button
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Language Selector
    const languageButtons = document.querySelectorAll('.language-btn');
    languageButtons.forEach(button => {
        button.addEventListener('click', () => changeLanguage(button.dataset.lang));
    });

    // Quick Links
    document.querySelectorAll('.quick-link-card').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href) {
                // Speichere die aktuelle Aktivität
                const activity = {
                    type: 'tool',
                    title: link.querySelector('h3').textContent,
                    description: `Zugriff auf ${link.querySelector('h3').textContent}`,
                    timestamp: new Date().toISOString()
                };
                
                // Lade bestehende Aktivitäten
                const activities = JSON.parse(localStorage.getItem('activity') || '[]');
                activities.unshift(activity);
                localStorage.setItem('activity', JSON.stringify(activities));
                
                // Aktualisiere die Statistiken
                const stats = JSON.parse(localStorage.getItem('stats') || '{}');
                stats.toolsUsed = (stats.toolsUsed || 0) + 1;
                localStorage.setItem('stats', JSON.stringify(stats));
                
                // Navigiere zur Zielseite
                window.location.href = href;
            }
        });
    });

    // Suchfunktion
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkModeIcon(isDarkMode);
}

// Update Dark Mode Icon
function updateDarkModeIcon(isDark) {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    }
}

// Change Language
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    updateLanguage();
}

// Update Language
function updateLanguage() {
    const lang = localStorage.getItem('preferredLanguage') || 'de';
    const translations = getTranslations(lang);

    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });

    // Update language buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
}

// Get Translations
function getTranslations(lang) {
    const translations = {
        de: {
            welcome: 'Willkommen zurück',
            progress: 'Fortschritt',
            goals: 'Ziele',
            learningAreas: 'Lernbereiche',
            interactiveTools: 'Interaktive Tools',
            recentActivity: 'Letzte Aktivitäten',
            quickStats: 'Schnellstatistiken',
            logout: 'Abmelden',
            quickAccess: 'Schnellzugriff',
            binaryCalculator: 'Binär-Rechner',
            subnetting: 'Subnetting',
            sqlFormatter: 'SQL-Formatter',
            prefixCalculator: 'Präfix-Rechner',
            htmlGuide: 'HTML Guide',
            flashcards: 'Karteikarten',
            games: 'Lernspiele',
            escapeRoom: 'Escape Room',
            binaryDesc: 'Konvertiere zwischen Binär- und Dezimalzahlen',
            subnettingDesc: 'Berechne Subnetze und Netzwerkadressen',
            sqlDesc: 'Formatiere und optimiere SQL-Abfragen',
            prefixDesc: 'Berechne Netzwerkpräfixe',
            htmlDesc: 'Lerne HTML von Grund auf',
            flashcardsDesc: 'Lerne mit interaktiven Karteikarten',
            gamesDesc: 'Spielerisch lernen',
            escapeDesc: 'Löse spannende Rätsel'
        },
        en: {
            welcome: 'Welcome back',
            progress: 'Progress',
            goals: 'Goals',
            learningAreas: 'Learning Areas',
            interactiveTools: 'Interactive Tools',
            recentActivity: 'Recent Activity',
            quickStats: 'Quick Stats',
            logout: 'Logout',
            quickAccess: 'Quick Access',
            binaryCalculator: 'Binary Calculator',
            subnetting: 'Subnetting',
            sqlFormatter: 'SQL Formatter',
            prefixCalculator: 'Prefix Calculator',
            htmlGuide: 'HTML Guide',
            flashcards: 'Flashcards',
            games: 'Learning Games',
            escapeRoom: 'Escape Room',
            binaryDesc: 'Convert between binary and decimal numbers',
            subnettingDesc: 'Calculate subnets and network addresses',
            sqlDesc: 'Format and optimize SQL queries',
            prefixDesc: 'Calculate network prefixes',
            htmlDesc: 'Learn HTML from scratch',
            flashcardsDesc: 'Learn with interactive flashcards',
            gamesDesc: 'Learn through play',
            escapeDesc: 'Solve exciting puzzles'
        }
    };
    return translations[lang] || translations['en'];
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);

// Navigation function
function navigateTo(page) {
    // Verhindere Standard-Link-Verhalten
    event.preventDefault();
    
    // Überprüfe, ob der Benutzer eingeloggt ist
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Speichere Aktivität
    const activity = {
        type: 'tool_access',
        tool: page,
        timestamp: new Date().toISOString()
    };
    
    // Aktualisiere Benutzeraktivitäten
    if (!currentUser.activities) {
        currentUser.activities = [];
    }
    currentUser.activities.push(activity);
    
    // Aktualisiere Statistiken
    if (!currentUser.stats) {
        currentUser.stats = {
            toolUsage: {}
        };
    }
    
    if (!currentUser.stats.toolUsage[page]) {
        currentUser.stats.toolUsage[page] = 0;
    }
    currentUser.stats.toolUsage[page]++;
    
    // Speichere aktualisierte Benutzerdaten
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Aktualisiere die Statistikanzeige
    updateStats();
    
    // Navigiere zur Zielseite
    window.location.href = page;
}

// Handle difficulty selection
document.querySelectorAll('.difficulty-btn').forEach(button => {
    button.addEventListener('click', function () {
        // Remove active class from all buttons in this selector
        this.parentElement.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        this.classList.add('active');

        // Store selected difficulty
        const game = this.closest('.game-card').querySelector('h3').textContent;
        localStorage.setItem(`${game.toLowerCase()}_difficulty`, this.dataset.level);

        // Show notification
        showNotification(`Schwierigkeitsgrad für ${game} auf ${this.textContent} gesetzt`, 'info');
    });
});

// Load saved difficulties
function loadSavedDifficulties() {
    document.querySelectorAll('.game-card').forEach(card => {
        const game = card.querySelector('h3').textContent;
        const savedDifficulty = localStorage.getItem(`${game.toLowerCase()}_difficulty`);
        if (savedDifficulty) {
            const button = card.querySelector(`[data-level="${savedDifficulty}"]`);
            if (button) {
                button.classList.add('active');
            }
        }
    });
}

// Update progress bars
function updateProgress() {
    const topics = ['sql', 'subnetting', 'binary', 'prefix'];
    topics.forEach(topic => {
        const progress = localStorage.getItem(`${topic}_progress`) || 0;
        const progressBar = document.querySelector(`[onclick="navigateTo('${topic}.html')"]`)
            .closest('.topic-card')
            .querySelector('.progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    });
}

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

// Add intersection observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.topic-card, .tool-card, .game-card').forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "all 0.5s ease-out";
    observer.observe(card);
});

// Suchfunktion
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const quickLinks = document.querySelectorAll('.quick-link-card');
    const activityItems = document.querySelectorAll('.activity-item');
    
    // Suche in Quick Links
    quickLinks.forEach(link => {
        const title = link.querySelector('h3').textContent.toLowerCase();
        const description = link.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            link.style.display = 'block';
        } else {
            link.style.display = 'none';
        }
    });
    
    // Suche in Aktivitäten
    activityItems.forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const description = item.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Aktualisiere die Anzeige der Suchergebnisse
    updateSearchResults(searchTerm);
}

// Aktualisiere Suchergebnisse
function updateSearchResults(searchTerm) {
    const searchResults = [];
    
    // Suche in Quick Links
    document.querySelectorAll('.quick-link-card').forEach(link => {
        const title = link.querySelector('h3').textContent;
        const description = link.querySelector('p').textContent;
        const href = link.getAttribute('href');
        
        if (title.toLowerCase().includes(searchTerm) || 
            description.toLowerCase().includes(searchTerm)) {
            searchResults.push({
                type: 'tool',
                title: title,
                description: description,
                href: href
            });
        }
    });
    
    // Suche in Aktivitäten
    dashboardState.recentActivity.forEach(activity => {
        if (activity.title.toLowerCase().includes(searchTerm) || 
            activity.description.toLowerCase().includes(searchTerm)) {
            searchResults.push({
                type: 'activity',
                title: activity.title,
                description: activity.description,
                timestamp: activity.timestamp
            });
        }
    });
    
    // Suche in allen verfügbaren Tools und Seiten
    const allTools = [
        { title: 'Binär-Rechner', description: 'Konvertiere zwischen Binär- und Dezimalzahlen', href: 'binary.html' },
        { title: 'Subnetting', description: 'Berechne Subnetze und Netzwerkadressen', href: 'subnetting.html' },
        { title: 'SQL-Formatter', description: 'Formatiere und optimiere SQL-Abfragen', href: 'sql.html' },
        { title: 'Präfix-Rechner', description: 'Berechne Netzwerkpräfixe', href: 'prefix.html' },
        { title: 'HTML Guide', description: 'Lerne HTML von Grund auf', href: 'html-guide.html' },
        { title: 'Karteikarten', description: 'Lerne mit interaktiven Karteikarten', href: 'flashcards.html' },
        { title: 'Lernspiele', description: 'Spielerisch lernen', href: 'games.html' },
        { title: 'Escape Room', description: 'Löse spannende Rätsel', href: 'escape-room.html' }
    ];

    allTools.forEach(tool => {
        if (tool.title.toLowerCase().includes(searchTerm) || 
            tool.description.toLowerCase().includes(searchTerm)) {
            searchResults.push({
                type: 'tool',
                title: tool.title,
                description: tool.description,
                href: tool.href
            });
        }
    });
    
    // Aktualisiere die Suchergebnisse im State
    dashboardState.searchResults = searchResults;
    
    // Zeige/Verstecke die "Keine Ergebnisse" Nachricht
    const noResultsMessage = document.querySelector('.no-results-message');
    if (noResultsMessage) {
        noResultsMessage.style.display = searchResults.length === 0 ? 'block' : 'none';
    }

    // Zeige die Suchergebnisse an
    displaySearchResults(searchResults);
}

// Zeige Suchergebnisse an
function displaySearchResults(results) {
    const searchResultsContainer = document.querySelector('.search-results-container');
    if (!searchResultsContainer) return;

    if (results.length === 0) {
        searchResultsContainer.innerHTML = '';
        return;
    }

    const resultsHTML = results.map(result => `
        <div class="search-result-item">
            <div class="result-icon">${getResultIcon(result.type)}</div>
            <div class="result-content">
                <h4>${result.title}</h4>
                <p>${result.description}</p>
                ${result.href ? `<a href="${result.href}" class="result-link">Öffnen</a>` : ''}
            </div>
        </div>
    `).join('');

    searchResultsContainer.innerHTML = resultsHTML;
}

// Icon für Suchergebnisse
function getResultIcon(type) {
    const icons = {
        tool: '🛠️',
        activity: '📝',
        flashcard: '📚',
        game: '🎮',
        escape: '🔐'
    };
    return icons[type] || '📌';
} 