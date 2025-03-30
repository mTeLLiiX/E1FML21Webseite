// Admin Dashboard State
const adminState = {
    currentUser: null,
    stats: {
        users: 0,
        content: 0,
        activities: 0
    },
    recentActivity: []
};

// Initialize Admin Dashboard
function initAdminDashboard() {
    checkAdminAuth();
    loadAdminData();
    loadStats();
    loadRecentActivity();
    setupEventListeners();
    setupNavigation();
    setupQuickLinks();
    checkDarkMode();
}

// Check Admin Authentication
function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    adminState.currentUser = user;
}

// Load Admin Data
function loadAdminData() {
    const adminName = document.querySelector('.admin-name');
    if (adminName) {
        adminName.textContent = adminState.currentUser.username;
    }
}

// Load Statistics
function loadStats() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const content = JSON.parse(localStorage.getItem('content')) || [];
    const activities = JSON.parse(localStorage.getItem('activities')) || [];

    adminState.stats = {
        users: users.length,
        content: content.length,
        activities: activities.length
    };

    updateStatsDisplay();
}

// Update Stats Display
function updateStatsDisplay() {
    const stats = adminState.stats;

    // Update users count
    const usersCount = document.querySelector('.stat-card:nth-child(1) .stat-info p');
    if (usersCount) {
        usersCount.textContent = stats.users;
    }

    // Update content count
    const contentCount = document.querySelector('.stat-card:nth-child(2) .stat-info p');
    if (contentCount) {
        contentCount.textContent = stats.content;
    }

    // Update activities count
    const activitiesCount = document.querySelector('.stat-card:nth-child(3) .stat-info p');
    if (activitiesCount) {
        activitiesCount.textContent = stats.activities;
    }
}

// Load Recent Activity
function loadRecentActivity() {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    adminState.recentActivity = activities.slice(-5).reverse();
    updateActivityDisplay();
}

// Update Activity Display
function updateActivityDisplay() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;

    activityList.innerHTML = adminState.recentActivity.map(activity => `
        <div class="activity-item" onclick="handleActivityClick('${activity.type}')">
            <div class="activity-icon">
                ${getActivityIcon(activity.type)}
            </div>
            <div class="activity-info">
                <h4>${activity.description}</h4>
                <p>${formatDate(activity.timestamp)}</p>
            </div>
        </div>
    `).join('');
}

// Get Activity Icon
function getActivityIcon(type) {
    const icons = {
        login: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>',
        register: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>',
        content: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
        default: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
    };

    return icons[type] || icons.default;
}

// Format Date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Setup Event Listeners
function setupEventListeners() {
    // Logout Button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Search Bar
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Stat Cards Click Events
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            switch (index) {
                case 0:
                    window.location.href = 'users.html';
                    break;
                case 1:
                    window.location.href = 'content.html';
                    break;
                case 2:
                    window.location.href = 'activities.html';
                    break;
            }
        });
    });
}

// Setup Navigation
function setupNavigation() {
    // Sidebar Navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
        });
    });

    // Quick Links
    const quickLinks = document.querySelectorAll('.quick-link');
    quickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
        });
    });
}

// Setup Quick Links
function setupQuickLinks() {
    const quickLinks = {
        'users.html': 'Benutzer verwalten',
        'content.html': 'Inhalte bearbeiten',
        'activities.html': 'Aktivitäten anzeigen',
        'reports.html': 'Berichte generieren',
        'analytics.html': 'Analysen anzeigen',
        'settings.html': 'Einstellungen anpassen'
    };

    const quickLinksContainer = document.querySelector('.quick-links');
    if (quickLinksContainer) {
        quickLinksContainer.innerHTML = Object.entries(quickLinks)
            .map(([href, text]) => `
                <a href="${href}" class="quick-link">
                    <div class="quick-link-icon">
                        ${getQuickLinkIcon(href)}
                    </div>
                    <span>${text}</span>
                </a>
            `).join('');
    }
}

// Get Quick Link Icon
function getQuickLinkIcon(href) {
    const icons = {
        'users.html': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
        'content.html': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
        'activities.html': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
        'reports.html': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
        'analytics.html': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
        'settings.html': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
    };

    return icons[href] || icons['content.html'];
}

// Handle Activity Click
function handleActivityClick(type) {
    switch (type) {
        case 'login':
            window.location.href = 'users.html';
            break;
        case 'register':
            window.location.href = 'users.html';
            break;
        case 'content':
            window.location.href = 'content.html';
            break;
        default:
            window.location.href = 'activities.html';
    }
}

// Check Dark Mode
function checkDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Toggle Theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Handle Search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    // Implement search functionality based on your needs
    console.log('Searching for:', searchTerm);
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Initialize Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initAdminDashboard); 