// import './bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.scss';



// Données du jeu - Valeurs de la République (chaque valeur apparaît 2 fois)
const gameValues = [
    { content: 'Liberté', icon: '🗽' },
    { content: 'Égalité', icon: '⚖️' },
    { content: 'Fraternité', icon: '🤝' },
    { content: 'Laïcité', icon: '🏛️' },
    { content: 'Démocratie', icon: '🗳️' },
    { content: 'Citoyenneté', icon: '👥' },
    { content: 'République', icon: '🇫🇷' },
    { content: 'Diversité', icon: '🌍' }
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;
let startTime = null;
let timerInterval = null;

// Initialiser le jeu
function initGame() {
    // Créer un tableau avec chaque valeur apparaissant 2 fois
    const allCards = [];

    // Ajouter chaque valeur 2 fois pour créer les paires
    gameValues.forEach((value, index) => {
        allCards.push({ content: value.content, icon: value.icon, pairId: index });
        allCards.push({ content: value.content, icon: value.icon, pairId: index });
    });

    // Mélanger les cartes
    cards = shuffleArray(allCards);

    // Réinitialiser les variables
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameStarted = false;
    startTime = null;

    // Réinitialiser l'affichage
    document.getElementById('moves').textContent = '0';
    document.getElementById('pairs').textContent = '0 / 8';
    document.getElementById('timer').textContent = '00:00';
    document.getElementById('message').innerHTML = '<p class="jeu__message-text">Cliquez sur deux cartes pour commencer !</p>';

    // Arrêter le timer s'il existe
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Créer le plateau de jeu
    renderBoard();
}

// Mélanger un tableau
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Rendre le plateau de jeu
function renderBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';

    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'carte';
        cardElement.dataset.index = index;
        cardElement.dataset.pairId = card.pairId;

        cardElement.innerHTML = `
            <div class="carte__front">
                <div class="carte__icon">🇫🇷</div>
                <div class="carte__text">?</div>
            </div>
            <div class="carte__back">
                <div class="carte__icon-back">${card.icon}</div>
                <div class="carte__content">${card.content}</div>
            </div>
        `;

        cardElement.addEventListener('click', () => flipCard(index));
        board.appendChild(cardElement);
    });
}

// Retourner une carte
function flipCard(index) {
    const card = cards[index];
    const cardElement = document.querySelector(`[data-index="${index}"]`);

    // Vérifier si la carte peut être retournée
    if (cardElement.classList.contains('carte--flipped') ||
        cardElement.classList.contains('carte--matched') ||
        flippedCards.length === 2) {
        return;
    }

    // Démarrer le timer au premier clic
    if (!gameStarted) {
        gameStarted = true;
        startTime = Date.now();
        startTimer();
    }

    // Retourner la carte
    cardElement.classList.add('carte--flipped');
    flippedCards.push({ index, card, element: cardElement });

    // Si deux cartes sont retournées, vérifier la correspondance
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;

        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

// Vérifier si les deux cartes forment une paire
function checkMatch() {
    const [first, second] = flippedCards;

    // Vérifier si c'est une paire (même pairId)
    if (first.card.pairId === second.card.pairId &&
        first.index !== second.index) {
        // Paire trouvée !
        first.element.classList.add('carte--matched');
        second.element.classList.add('carte--matched');
        matchedPairs++;

        document.getElementById('pairs').textContent = `${matchedPairs} / 8`;

        // Vérifier si le jeu est terminé
        if (matchedPairs === 8) {
            endGame();
        } else {
            showMessage('Bravo ! Paire trouvée ! 🎉', 'success');
        }
    } else {
        // Pas de paire, retourner les cartes
        first.element.classList.remove('carte--flipped');
        second.element.classList.remove('carte--flipped');
        showMessage('Essayez encore ! 💪', 'error');
    }

    // Réinitialiser les cartes retournées
    flippedCards = [];
}

// Afficher un message
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.className = `jeu__message jeu__message--${type}`;
    messageDiv.innerHTML = `<p class="jeu__message-text">${text}</p>`;

    setTimeout(() => {
        messageDiv.className = 'jeu__message';
        messageDiv.innerHTML = '<p class="jeu__message-text">Cliquez sur deux cartes pour continuer !</p>';
    }, 2000);
}

// Démarrer le timer
function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// Terminer le jeu
function endGame() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const messageDiv = document.getElementById('message');
    messageDiv.className = 'jeu__message jeu__message--success';
    messageDiv.innerHTML = `
        <p class="jeu__message-text jeu__message-text--big">🎉 Félicitations ! 🎉</p>
        <p class="jeu__message-text">Vous avez trouvé toutes les paires !</p>
        <p class="jeu__message-text">Temps : ${timeString} | Coups : ${moves}</p>
    `;

    fetch('/jeu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            moves: moves
        })
    })
    .catch(error => console.error('Erreur:', error));
}

// Bouton de redémarrage
document.getElementById('restartBtn').addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    initGame();
});

// Initialiser le jeu au chargement
initGame();