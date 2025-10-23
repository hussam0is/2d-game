// Blackjack Game Logic

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

    get numericValue() {
        if (this.value === 'A') return 11;
        if (['K', 'Q', 'J'].includes(this.value)) return 10;
        return parseInt(this.value);
    }

    get displayValue() {
        return this.value + this.suit;
    }
}

class Deck {
    constructor(numberOfDecks = 1) {
        this.numberOfDecks = numberOfDecks;
        this.cards = [];
        this.totalCards = 0;
        this.shuffleThreshold = 0;
        this.needsShuffle = false;
        this.reset();
    }

    reset() {
        const suits = ['♠️', '♥️', '♣️', '♦️'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.cards = [];

        // Create multiple decks
        for (let deckNum = 0; deckNum < this.numberOfDecks; deckNum++) {
            for (let suit of suits) {
                for (let value of values) {
                    this.cards.push(new Card(suit, value));
                }
            }
        }

        this.totalCards = this.cards.length;
        // Shuffle when 25% of cards remain (75% penetration - realistic casino practice)
        this.shuffleThreshold = Math.floor(this.totalCards * 0.25);
        this.needsShuffle = false;

        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        this.needsShuffle = false;
    }

    draw() {
        // Check if we need to shuffle (but don't shuffle mid-hand)
        if (this.cards.length <= this.shuffleThreshold && !this.needsShuffle) {
            this.needsShuffle = true;
        }

        // If completely out of cards (safety check), force reset
        if (this.cards.length === 0) {
            this.reset();
        }

        return this.cards.pop();
    }

    shouldShuffle() {
        return this.needsShuffle;
    }

    getCardsRemaining() {
        return this.cards.length;
    }

    getPenetration() {
        return Math.floor(((this.totalCards - this.cards.length) / this.totalCards) * 100);
    }
}

class BlackjackGame {
    constructor() {
        this.playerHand = [];
        this.dealerHand = [];
        this.chips = 1000;
        this.currentBet = 0;
        this.gameActive = false;
        this.dealerHidden = false;

        this.initializeElements();
        this.initializeDeck(); // Initialize deck based on selector
        this.attachEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        // UI Elements
        this.chipsDisplay = document.getElementById('chips');
        this.betDisplay = document.getElementById('current-bet');
        this.cardsRemainingDisplay = document.getElementById('cards-remaining');
        this.playerCardsEl = document.getElementById('player-cards');
        this.dealerCardsEl = document.getElementById('dealer-cards');
        this.playerScoreEl = document.getElementById('player-score');
        this.dealerScoreEl = document.getElementById('dealer-score');
        this.messageEl = document.getElementById('message');

        // Control sections
        this.bettingControls = document.getElementById('betting-controls');
        this.gameControls = document.getElementById('game-controls');
        this.newGameControls = document.getElementById('new-game-controls');

        // Buttons
        this.dealBtn = document.getElementById('deal-btn');
        this.hitBtn = document.getElementById('hit-btn');
        this.standBtn = document.getElementById('stand-btn');
        this.doubleBtn = document.getElementById('double-btn');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.betButtons = document.querySelectorAll('.bet-btn');

        // Deck selector
        this.deckCountSelect = document.getElementById('deck-count');
    }

    initializeDeck() {
        const deckCount = parseInt(this.deckCountSelect.value);
        this.deck = new Deck(deckCount);
    }

    attachEventListeners() {
        this.betButtons.forEach(btn => {
            btn.addEventListener('click', () => this.placeBet(parseInt(btn.dataset.amount)));
        });

        this.dealBtn.addEventListener('click', () => this.deal());

        // Handle deck count change
        this.deckCountSelect.addEventListener('change', () => {
            if (!this.gameActive) {
                this.initializeDeck();
                this.showMessage(`Deck changed to ${this.deckCountSelect.value} deck(s)`, 'info');
            }
        });
        this.hitBtn.addEventListener('click', () => this.hit());
        this.standBtn.addEventListener('click', () => this.stand());
        this.doubleBtn.addEventListener('click', () => this.doubleDown());
        this.newGameBtn.addEventListener('click', () => this.resetGame());
    }

    placeBet(amount) {
        if (this.gameActive) return;

        if (amount > this.chips) {
            this.showMessage('Not enough chips!', 'error');
            return;
        }

        this.currentBet = amount;
        this.dealBtn.disabled = false;
        this.updateDisplay();
        this.showMessage(`Bet placed: $${amount}`, 'info');
    }

    deal() {
        if (this.currentBet === 0 || this.currentBet > this.chips) return;

        this.gameActive = true;
        this.dealerHidden = true;
        this.playerHand = [];
        this.dealerHand = [];

        // Deal initial cards
        this.playerHand.push(this.deck.draw());
        this.dealerHand.push(this.deck.draw());
        this.playerHand.push(this.deck.draw());
        this.dealerHand.push(this.deck.draw());

        this.showControls('game');
        this.updateDisplay();

        // Check for blackjack
        if (this.getHandValue(this.playerHand) === 21) {
            this.dealerHidden = false;
            this.updateDisplay();
            if (this.getHandValue(this.dealerHand) === 21) {
                this.endGame('push', 'Both have Blackjack! Push.');
            } else {
                this.endGame('blackjack', 'Blackjack! You win!');
            }
        }
    }

    hit() {
        if (!this.gameActive) return;

        this.playerHand.push(this.deck.draw());
        this.updateDisplay();

        const playerValue = this.getHandValue(this.playerHand);
        if (playerValue > 21) {
            this.dealerHidden = false;
            this.updateDisplay();
            this.endGame('lose', 'Bust! You lose.');
        } else if (playerValue === 21) {
            this.stand();
        }
    }

    stand() {
        if (!this.gameActive) return;

        this.dealerHidden = false;
        this.gameActive = false;

        // Dealer draws until 17 or higher
        while (this.getHandValue(this.dealerHand) < 17) {
            this.dealerHand.push(this.deck.draw());
        }

        this.updateDisplay();
        this.determineWinner();
    }

    doubleDown() {
        if (!this.gameActive || this.currentBet * 2 > this.chips) return;

        this.currentBet *= 2;
        this.hit();

        if (this.gameActive) {
            this.stand();
        }
    }

    determineWinner() {
        const playerValue = this.getHandValue(this.playerHand);
        const dealerValue = this.getHandValue(this.dealerHand);

        if (dealerValue > 21) {
            this.endGame('win', 'Dealer busts! You win!');
        } else if (playerValue > dealerValue) {
            this.endGame('win', 'You win!');
        } else if (playerValue < dealerValue) {
            this.endGame('lose', 'Dealer wins!');
        } else {
            this.endGame('push', 'Push! It\'s a tie.');
        }
    }

    endGame(result, message) {
        this.gameActive = false;

        switch(result) {
            case 'win':
                this.chips += this.currentBet;
                break;
            case 'lose':
                this.chips -= this.currentBet;
                break;
            case 'blackjack':
                this.chips += Math.floor(this.currentBet * 1.5);
                break;
            case 'push':
                // No change in chips
                break;
        }

        // Check if shuffle is needed (realistic casino practice)
        if (this.deck.shouldShuffle()) {
            message += ' | Shuffling deck...';
            setTimeout(() => {
                this.deck.reset();
                this.updateDisplay();
                this.showMessage('Deck shuffled! Fresh shoe.', 'info');
            }, 2000);
        }

        this.showMessage(message, result);
        this.showControls('new');
        this.updateDisplay();

        if (this.chips <= 0) {
            this.showMessage('Game Over! No more chips. Resetting...', 'error');
            setTimeout(() => this.resetGame(), 3000);
        }
    }

    resetGame() {
        this.currentBet = 0;
        this.dealBtn.disabled = true;
        this.showControls('betting');
        this.playerHand = [];
        this.dealerHand = [];
        this.updateDisplay();
        this.showMessage('Place your bet to start a new round', 'info');
    }

    getHandValue(hand) {
        let value = 0;
        let aces = 0;

        for (let card of hand) {
            value += card.numericValue;
            if (card.value === 'A') aces++;
        }

        // Adjust for aces
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }

        return value;
    }

    showControls(type) {
        this.bettingControls.classList.add('hidden');
        this.gameControls.classList.add('hidden');
        this.newGameControls.classList.add('hidden');

        switch(type) {
            case 'betting':
                this.bettingControls.classList.remove('hidden');
                break;
            case 'game':
                this.gameControls.classList.remove('hidden');
                break;
            case 'new':
                this.newGameControls.classList.remove('hidden');
                break;
        }
    }

    showMessage(text, type) {
        this.messageEl.textContent = text;
        this.messageEl.className = `message ${type}`;
    }

    updateDisplay() {
        // Update chips, bet, and cards remaining
        this.chipsDisplay.textContent = this.chips;
        this.betDisplay.textContent = this.currentBet;
        this.cardsRemainingDisplay.textContent = this.deck.getCardsRemaining();

        // Add warning color if running low on cards
        if (this.deck.shouldShuffle()) {
            this.cardsRemainingDisplay.style.color = '#ff5722';
        } else {
            this.cardsRemainingDisplay.style.color = '';
        }

        // Update player cards
        this.playerCardsEl.innerHTML = this.playerHand
            .map(card => `<div class="card">${card.displayValue}</div>`)
            .join('');

        // Update dealer cards
        if (this.dealerHidden && this.dealerHand.length > 0) {
            this.dealerCardsEl.innerHTML =
                `<div class="card">🂠</div>` +
                this.dealerHand.slice(1)
                    .map(card => `<div class="card">${card.displayValue}</div>`)
                    .join('');
        } else {
            this.dealerCardsEl.innerHTML = this.dealerHand
                .map(card => `<div class="card">${card.displayValue}</div>`)
                .join('');
        }

        // Update scores
        if (this.playerHand.length > 0) {
            this.playerScoreEl.textContent = `(${this.getHandValue(this.playerHand)})`;
        } else {
            this.playerScoreEl.textContent = '';
        }

        if (this.dealerHand.length > 0 && !this.dealerHidden) {
            this.dealerScoreEl.textContent = `(${this.getHandValue(this.dealerHand)})`;
        } else {
            this.dealerScoreEl.textContent = '';
        }

        // Enable/disable double down based on hand size and chips
        this.doubleBtn.disabled = this.playerHand.length !== 2 || this.currentBet * 2 > this.chips;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlackjackGame();
});
