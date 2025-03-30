// Karteikarten-Verwaltung
let cards = [];
let currentCardIndex = 0;
let statistics = {
    total: 0,
    understood: 0,
    notUnderstood: 0
};

// DOM-Elemente
const flashcard = document.querySelector('.flashcard');
const question = document.getElementById('question');
const answer = document.getElementById('answer');
const showAnswerBtn = document.getElementById('show-answer');
const feedbackButtons = document.querySelector('.feedback-buttons');
const understoodBtn = document.getElementById('understood');
const notUnderstoodBtn = document.getElementById('not-understood');
const newQuestionInput = document.getElementById('new-question');
const newAnswerInput = document.getElementById('new-answer');
const saveCardBtn = document.getElementById('save-card');

// Statistik-Elemente
const totalCardsElement = document.getElementById('total-cards');
const correctCardsElement = document.getElementById('correct-cards');
const incorrectCardsElement = document.getElementById('incorrect-cards');

// Event Listeners
showAnswerBtn.addEventListener('click', flipCard);
understoodBtn.addEventListener('click', () => markCard('understood'));
notUnderstoodBtn.addEventListener('click', () => markCard('notUnderstood'));
saveCardBtn.addEventListener('click', saveNewCard);
flashcard.addEventListener('click', flipCard);

// Lade gespeicherte Karten und Statistiken
loadFromLocalStorage();

// Funktionen
function flipCard() {
    flashcard.classList.toggle('flipped');
    if (flashcard.classList.contains('flipped')) {
        showAnswerBtn.style.display = 'none';
        feedbackButtons.style.display = 'block';
    } else {
        showAnswerBtn.style.display = 'block';
        feedbackButtons.style.display = 'none';
    }
}

function markCard(status) {
    if (status === 'understood') {
        statistics.understood++;
    } else {
        statistics.notUnderstood++;
    }
    updateStatistics();
    saveToLocalStorage();
    showNextCard();
}

function showNextCard() {
    if (cards.length === 0) {
        question.textContent = 'Keine Karten verfügbar';
        answer.textContent = 'Erstellen Sie neue Karten';
        return;
    }

    currentCardIndex = (currentCardIndex + 1) % cards.length;
    showCard(currentCardIndex);
}

function showCard(index) {
    flashcard.classList.remove('flipped');
    showAnswerBtn.style.display = 'block';
    feedbackButtons.style.display = 'none';
    
    question.textContent = cards[index].question;
    answer.textContent = cards[index].answer;
}

function saveNewCard() {
    const newQuestion = newQuestionInput.value.trim();
    const newAnswer = newAnswerInput.value.trim();

    if (newQuestion && newAnswer) {
        const newCard = {
            question: newQuestion,
            answer: newAnswer,
            status: 'new'
        };

        cards.push(newCard);
        statistics.total++;
        updateStatistics();
        saveToLocalStorage();

        // Formular zurücksetzen
        newQuestionInput.value = '';
        newAnswerInput.value = '';

        // Zeige die neue Karte an, wenn es die erste ist
        if (cards.length === 1) {
            showCard(0);
        }
    }
}

function updateStatistics() {
    totalCardsElement.textContent = statistics.total;
    correctCardsElement.textContent = statistics.understood;
    incorrectCardsElement.textContent = statistics.notUnderstood;
}

function saveToLocalStorage() {
    localStorage.setItem('flashcards', JSON.stringify(cards));
    localStorage.setItem('flashcardStats', JSON.stringify(statistics));
}

function loadFromLocalStorage() {
    const savedCards = localStorage.getItem('flashcards');
    const savedStats = localStorage.getItem('flashcardStats');

    if (savedCards) {
        cards = JSON.parse(savedCards);
        if (cards.length > 0) {
            showCard(0);
        }
    }

    if (savedStats) {
        statistics = JSON.parse(savedStats);
        updateStatistics();
    }
} 