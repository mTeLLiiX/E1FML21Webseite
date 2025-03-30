// Memory Game
let memoryCards = [];
let flippedCards = [];
let moves = 0;
let timer = null;
let seconds = 0;

function startMemoryGame() {
    const category = document.getElementById('memory-category').value;
    memoryCards = [];
    flippedCards = [];
    moves = 0;
    seconds = 0;

    // Reset display
    document.getElementById('memory-moves').textContent = '0';
    document.getElementById('memory-time').textContent = '0:00';
    document.querySelector('.memory-grid').innerHTML = '';

    // Load cards based on category
    loadMemoryCards(category);

    // Start timer
    if (timer) clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

function loadMemoryCards(category) {
    const cardPairs = getCardPairs(category);
    memoryCards = [...cardPairs, ...cardPairs];
    memoryCards = shuffleArray(memoryCards);

    // Create card elements
    memoryCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.index = index;
        cardElement.dataset.value = card;
        cardElement.onclick = () => flipCard(cardElement);
        document.querySelector('.memory-grid').appendChild(cardElement);
    });
}

function flipCard(cardElement) {
    if (flippedCards.length === 2 || cardElement.classList.contains('flipped')) return;

    cardElement.classList.add('flipped');
    cardElement.textContent = cardElement.dataset.value;
    flippedCards.push(cardElement);

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('memory-moves').textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        flippedCards = [];
        checkWin();
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
            flippedCards = [];
        }, 1000);
    }
}

function checkWin() {
    const allCards = document.querySelectorAll('.memory-card');
    const allFlipped = Array.from(allCards).every(card => card.classList.contains('flipped'));

    if (allFlipped) {
        clearInterval(timer);
        updateMemoryStats();
        showNotification('Gratulation! Du hast das Memory-Spiel gewonnen!', 'success');
    }
}

function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById('memory-time').textContent =
        `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Quiz System
let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    const category = document.getElementById('quiz-category').value;
    const difficulty = document.getElementById('quiz-difficulty').value;

    currentQuiz = getQuizQuestions(category, difficulty);
    currentQuestionIndex = 0;
    score = 0;

    // Reset display
    document.getElementById('quiz-progress').textContent = '0/0';
    document.getElementById('quiz-score').textContent = '0';
    document.getElementById('quiz-feedback').textContent = '';

    displayQuestion();
}

function displayQuestion() {
    if (currentQuestionIndex >= currentQuiz.length) {
        endQuiz();
        return;
    }

    const question = currentQuiz[currentQuestionIndex];
    document.getElementById('quiz-question').textContent = question.question;
    document.getElementById('quiz-progress').textContent =
        `${currentQuestionIndex + 1}/${currentQuiz.length}`;

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex) {
    const question = currentQuiz[currentQuestionIndex];
    const options = document.querySelectorAll('.quiz-option');

    options.forEach(option => option.disabled = true);
    options[selectedIndex].classList.add(
        selectedIndex === question.correctIndex ? 'correct' : 'incorrect'
    );

    if (selectedIndex === question.correctIndex) {
        score++;
        document.getElementById('quiz-score').textContent = score;
    }

    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 1000);
}

function endQuiz() {
    const percentage = (score / currentQuiz.length) * 100;
    document.getElementById('quiz-feedback').textContent =
        `Quiz beendet! Deine Punktzahl: ${percentage.toFixed(1)}%`;

    updateQuizStats();
    showNotification('Quiz abgeschlossen!', 'success');
}

// Interactive Exercises
let currentExercise = null;
let exerciseCount = 0;
let exerciseSuccess = 0;

function loadExercises() {
    const category = document.getElementById('exercise-category').value;
    const exercises = getExercises(category);

    exerciseCount = exercises.length;
    exerciseSuccess = 0;

    document.getElementById('exercise-count').textContent = exerciseCount;
    document.getElementById('exercise-success').textContent = '0%';

    displayNextExercise(exercises);
}

function displayNextExercise(exercises) {
    if (exercises.length === 0) {
        endExercises();
        return;
    }

    currentExercise = exercises.pop();
    const content = document.getElementById('exercise-content');

    content.innerHTML = `
        <h3>${currentExercise.question}</h3>
        <input type="text" class="exercise-input" placeholder="Deine Antwort...">
        <button onclick="checkExerciseAnswer()" class="btn">Überprüfen</button>
    `;
}

function checkExerciseAnswer() {
    const input = document.querySelector('.exercise-input');
    const answer = input.value.trim();
    const feedback = document.getElementById('exercise-feedback');

    if (answer === currentExercise.answer) {
        feedback.textContent = 'Richtig!';
        feedback.style.color = '#4CAF50';
        exerciseSuccess++;
    } else {
        feedback.textContent = 'Falsch. Versuche es noch einmal!';
        feedback.style.color = '#f44336';
    }

    const successRate = (exerciseSuccess / exerciseCount) * 100;
    document.getElementById('exercise-success').textContent = `${successRate.toFixed(1)}%`;

    if (answer === currentExercise.answer) {
        setTimeout(() => {
            displayNextExercise(getExercises(document.getElementById('exercise-category').value));
        }, 1000);
    }
}

function endExercises() {
    updateExerciseStats();
    showNotification('Alle Übungen abgeschlossen!', 'success');
}

// Statistics
function updateMemoryStats() {
    const stats = JSON.parse(localStorage.getItem('memory_stats') || '{}');
    const gamesPlayed = (stats.gamesPlayed || 0) + 1;
    const bestTime = stats.bestTime ? Math.min(stats.bestTime, seconds) : seconds;

    localStorage.setItem('memory_stats', JSON.stringify({
        gamesPlayed,
        bestTime
    }));

    document.getElementById('memory-games').textContent = gamesPlayed;
    document.getElementById('memory-best-time').textContent =
        `${Math.floor(bestTime / 60)}:${(bestTime % 60).toString().padStart(2, '0')}`;
}

function updateQuizStats() {
    const stats = JSON.parse(localStorage.getItem('quiz_stats') || '{}');
    const completed = (stats.completed || 0) + 1;
    const totalScore = (stats.totalScore || 0) + score;
    const average = totalScore / completed;

    localStorage.setItem('quiz_stats', JSON.stringify({
        completed,
        totalScore,
        average
    }));

    document.getElementById('quiz-completed').textContent = completed;
    document.getElementById('quiz-average').textContent = `${average.toFixed(1)}%`;
}

function updateExerciseStats() {
    const stats = JSON.parse(localStorage.getItem('exercise_stats') || '{}');
    const completed = (stats.completed || 0) + exerciseCount;
    const success = (stats.success || 0) + exerciseSuccess;
    const average = (success / completed) * 100;

    localStorage.setItem('exercise_stats', JSON.stringify({
        completed,
        success,
        average
    }));

    document.getElementById('exercise-completed').textContent = completed;
    document.getElementById('exercise-average').textContent = `${average.toFixed(1)}%`;
}

// Utility Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getCardPairs(category) {
    // Example card pairs - in a real application, these would come from a database
    const pairs = {
        sql: ['SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'ORDER BY'],
        subnetting: ['/24', '/16', '/8', '255.255.255.0', '255.255.0.0', '255.0.0.0'],
        binary: ['0000', '0001', '0010', '0011', '0100', '0101']
    };

    return pairs[category] || pairs.sql;
}

function getQuizQuestions(category, difficulty) {
    // Example questions - in a real application, these would come from a database
    const questions = {
        sql: [
            {
                question: 'Was ist der Befehl zum Abrufen von Daten?',
                options: ['SELECT', 'GET', 'FETCH', 'RETRIEVE'],
                correctIndex: 0
            },
            {
                question: 'Wie filtert man Daten in SQL?',
                options: ['FILTER', 'WHERE', 'IF', 'CONDITION'],
                correctIndex: 1
            }
        ],
        subnetting: [
            {
                question: 'Was ist die Subnetzmaske für /24?',
                options: ['255.255.255.0', '255.255.0.0', '255.0.0.0', '0.0.0.0'],
                correctIndex: 0
            }
        ],
        binary: [
            {
                question: 'Was ist 1010 in Dezimal?',
                options: ['8', '9', '10', '11'],
                correctIndex: 2
            }
        ]
    };

    return questions[category] || questions.sql;
}

function getExercises(category) {
    // Example exercises - in a real application, these would come from a database
    const exercises = {
        sql: [
            {
                question: 'Schreibe einen SQL-Befehl, um alle Benutzer aus der Tabelle "users" abzurufen.',
                answer: 'SELECT * FROM users;'
            }
        ],
        subnetting: [
            {
                question: 'Berechne die Subnetzmaske für /24',
                answer: '255.255.255.0'
            }
        ],
        binary: [
            {
                question: 'Konvertiere 1010 in Dezimal',
                answer: '10'
            }
        ]
    };

    return exercises[category] || exercises.sql;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Load saved statistics
    const memoryStats = JSON.parse(localStorage.getItem('memory_stats') || '{}');
    const quizStats = JSON.parse(localStorage.getItem('quiz_stats') || '{}');
    const exerciseStats = JSON.parse(localStorage.getItem('exercise_stats') || '{}');

    document.getElementById('memory-games').textContent = memoryStats.gamesPlayed || 0;
    document.getElementById('memory-best-time').textContent =
        memoryStats.bestTime ?
            `${Math.floor(memoryStats.bestTime / 60)}:${(memoryStats.bestTime % 60).toString().padStart(2, '0')}` :
            '-';

    document.getElementById('quiz-completed').textContent = quizStats.completed || 0;
    document.getElementById('quiz-average').textContent =
        quizStats.average ? `${quizStats.average.toFixed(1)}%` : '0%';

    document.getElementById('exercise-completed').textContent = exerciseStats.completed || 0;
    document.getElementById('exercise-average').textContent =
        exerciseStats.average ? `${exerciseStats.average.toFixed(1)}%` : '0%';
});

// Game State
const gameState = {
    currentGame: null,
    difficulty: 'medium',
    score: 0,
    questions: [],
    currentQuestion: 0
};

// Game Content
const gameContent = {
    sqlQuiz: {
        title: {
            de: 'SQL Quiz',
            en: 'SQL Quiz',
            ru: 'SQL Викторина',
            so: 'SQL Quiz'
        },
        description: {
            de: 'Teste dein SQL-Wissen mit interaktiven Fragen',
            en: 'Test your SQL knowledge with interactive questions',
            ru: 'Проверьте свои знания SQL с помощью интерактивных вопросов',
            so: 'Hubi xogtaada SQL-ka adigoo isticmaalaya su\'aalaha isdhexgalka ah'
        },
        questions: [
            {
                question: {
                    de: 'Was ist der Befehl zum Erstellen einer neuen Tabelle?',
                    en: 'What is the command to create a new table?',
                    ru: 'Какова команда для создания новой таблицы?',
                    so: 'Waa maxay amar-ka loo sameeyo table cusub?'
                },
                options: [
                    {
                        de: 'CREATE TABLE',
                        en: 'CREATE TABLE',
                        ru: 'CREATE TABLE',
                        so: 'CREATE TABLE'
                    },
                    {
                        de: 'NEW TABLE',
                        en: 'NEW TABLE',
                        ru: 'NEW TABLE',
                        so: 'NEW TABLE'
                    },
                    {
                        de: 'MAKE TABLE',
                        en: 'MAKE TABLE',
                        ru: 'MAKE TABLE',
                        so: 'MAKE TABLE'
                    }
                ],
                correct: 0
            }
        ]
    },
    binaryMemory: {
        title: {
            de: 'Binärgedächtnis',
            en: 'Binary Memory',
            ru: 'Бинарная память',
            so: 'Binary Memory'
        },
        description: {
            de: 'Merke dir die binären Zahlen und finde die passenden Paare',
            en: 'Remember the binary numbers and find the matching pairs',
            ru: 'Запомните двоичные числа и найдите соответствующие пары',
            so: 'Xusuuso lambarada binary-ga oo raadi labada isku mid ah'
        }
    },
    subnettingChallenge: {
        title: {
            de: 'Subnetz-Herausforderung',
            en: 'Subnetting Challenge',
            ru: 'Задача подсетей',
            so: 'Subnetting Challenge'
        },
        description: {
            de: 'Löse Subnetz-Aufgaben und verbessere dein Netzwerkverständnis',
            en: 'Solve subnetting problems and improve your network understanding',
            ru: 'Решайте задачи подсетей и улучшайте понимание сети',
            so: 'Xalliso dhibaatooyinka subnetting-ka oo hagaaji fahamkaaga network-ka'
        }
    },
    networkTopology: {
        title: {
            de: 'Netzwerk-Topologie-Builder',
            en: 'Network Topology Builder',
            ru: 'Конструктор топологии сети',
            so: 'Network Topology Builder'
        },
        description: {
            de: 'Erstelle und verstehe verschiedene Netzwerktopologien',
            en: 'Create and understand different network topologies',
            ru: 'Создавайте и понимайте различные топологии сети',
            so: 'Samee oo faham topology-ga network-ka kala duwan'
        }
    }
};

// Initialize the games page
function initGames() {
    setupEventListeners();
    loadDifficultyPreference();
    displayGames();
}

// Event Listeners
function setupEventListeners() {
    // Difficulty selector
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const difficulty = btn.getAttribute('data-difficulty');
            setDifficulty(difficulty);
        });
    });

    // Modal close button
    document.querySelector('.close-modal').addEventListener('click', closeGame);
}

// Game Management
function startGame(gameType) {
    gameState.currentGame = gameType;
    gameState.score = 0;
    gameState.currentQuestion = 0;
    
    // Show game modal
    const modal = document.getElementById('game-modal');
    modal.style.display = 'block';
    
    // Load game content
    loadGameContent(gameType);
}

function closeGame() {
    const modal = document.getElementById('game-modal');
    modal.style.display = 'none';
    gameState.currentGame = null;
    gameState.score = 0;
    gameState.currentQuestion = 0;
}

// Difficulty Management
function setDifficulty(difficulty) {
    gameState.difficulty = difficulty;
    saveDifficultyPreference();
    
    // Update UI
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-difficulty') === difficulty) {
            btn.classList.add('active');
        }
    });
}

function saveDifficultyPreference() {
    localStorage.setItem('gameDifficulty', gameState.difficulty);
}

function loadDifficultyPreference() {
    const savedDifficulty = localStorage.getItem('gameDifficulty');
    if (savedDifficulty) {
        setDifficulty(savedDifficulty);
    }
}

// Game Content Loading
function loadGameContent(gameType) {
    const content = gameContent[gameType];
    const modalContent = document.querySelector('.modal-content');
    
    // Update title and description
    const title = content.title[gameState.currentLanguage];
    const description = content.description[gameState.currentLanguage];
    
    modalContent.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <div id="game-container"></div>
    `;
    
    // Initialize specific game
    switch(gameType) {
        case 'sqlQuiz':
            initSQLQuiz();
            break;
        case 'binaryMemory':
            initBinaryMemory();
            break;
        case 'subnettingChallenge':
            initSubnettingChallenge();
            break;
        case 'networkTopology':
            initNetworkTopology();
            break;
    }
}

// Game Initialization Functions
function initSQLQuiz() {
    const container = document.getElementById('game-container');
    const currentQuestion = gameContent.sqlQuiz.questions[gameState.currentQuestion];
    
    container.innerHTML = `
        <div class="question">
            <p>${currentQuestion.question[gameState.currentLanguage]}</p>
        </div>
        <div class="options">
            ${currentQuestion.options.map((option, index) => `
                <button onclick="checkAnswer(${index})">
                    ${option[gameState.currentLanguage]}
                </button>
            `).join('')}
        </div>
        <div class="score">
            ${getTranslation('score')}: ${gameState.score}
        </div>
    `;
}

function initBinaryMemory() {
    // Implementation for binary memory game
}

function initSubnettingChallenge() {
    // Implementation for subnetting challenge
}

function initNetworkTopology() {
    // Implementation for network topology builder
}

// Helper Functions
function getTranslation(key) {
    const translations = {
        score: {
            de: 'Punktzahl',
            en: 'Score',
            ru: 'Счет',
            so: 'Score'
        }
    };
    return translations[key][gameState.currentLanguage];
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGames); 