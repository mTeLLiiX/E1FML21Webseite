// Suchfunktionalität
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchResultsContainer = document.querySelector('.search-results-container');
    const noResultsMessage = document.querySelector('.no-results-message');

    // Suchdaten
    const searchData = [
        {
            title: 'Binär-Rechner',
            description: 'Konvertiere zwischen Binär- und Dezimalzahlen',
            icon: '🔢',
            link: 'binary.html'
        },
        {
            title: 'Subnetting',
            description: 'Berechne Subnetze und Netzwerkadressen',
            icon: '🌐',
            link: 'subnetting.html'
        },
        {
            title: 'SQL-Formatter',
            description: 'Formatiere und optimiere SQL-Abfragen',
            icon: '💾',
            link: 'sql.html'
        },
        {
            title: 'Präfix-Rechner',
            description: 'Berechne Netzwerkpräfixe',
            icon: '📡',
            link: 'prefix.html'
        },
        {
            title: 'HTML Guide',
            description: 'Lerne HTML von Grund auf',
            icon: '🌐',
            link: 'htmlguide.html'
        },
        {
            title: 'Karteikarten',
            description: 'Lerne mit interaktiven Karteikarten',
            icon: '📝',
            link: 'flashcards.html'
        },
        {
            title: 'Lernspiele',
            description: 'Spielerisch lernen',
            icon: '🎮',
            link: 'games.html'
        },
        {
            title: 'Escape Room',
            description: 'Löse spannende Rätsel',
            icon: '🔐',
            link: 'escaperoom.html'
        }
    ];

    // Suchfunktion
    function performSearch(query) {
        const results = searchData.filter(item => {
            const searchTerm = query.toLowerCase();
            return item.title.toLowerCase().includes(searchTerm) ||
                   item.description.toLowerCase().includes(searchTerm);
        });

        displayResults(results);
    }

    // Ergebnisse anzeigen
    function displayResults(results) {
        searchResultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            noResultsMessage.style.display = 'block';
            searchResultsContainer.style.display = 'none';
            return;
        }

        noResultsMessage.style.display = 'none';
        searchResultsContainer.style.display = 'block';

        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'search-result-item';
            resultElement.innerHTML = `
                <div class="result-icon">${result.icon}</div>
                <div class="result-content">
                    <h4>${result.title}</h4>
                    <p>${result.description}</p>
                    <a href="${result.link}" class="result-link" data-translate="open">Öffnen</a>
                </div>
            `;
            searchResultsContainer.appendChild(resultElement);
        });
    }

    // Event Listener für die Sucheingabe
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            performSearch(query);
        } else {
            searchResultsContainer.style.display = 'none';
            noResultsMessage.style.display = 'none';
        }
    });

    // Schließe Suchergebnisse beim Klick außerhalb
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResultsContainer.contains(e.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });

    // Verhindere das Schließen beim Klick auf die Suchergebnisse
    searchResultsContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}); 