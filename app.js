/**
 * Blackjack Pro - Production-Ready Professional Casino Blackjack
 * @version 2.0.0
 * @author Blackjack Pro Team
 * @license MIT
 */

'use strict';

/**
 * Global error handler for production
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // In production, send to error tracking service
    trackError(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    trackError(event.reason);
});

/**
 * Error tracking stub (replace with actual service like Sentry)
 */
function trackError(error) {
    // Placeholder for error tracking service
    console.log('Error tracked:', error);
}

/**
 * Analytics tracking stub (replace with actual service like GA4)
 */
function trackEvent(category, action, label, value) {
    // Placeholder for analytics service
    console.log('Event tracked:', { category, action, label, value });
}

/**
 * Safe localStorage wrapper with error handling
 */
const SafeStorage = {
    getItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error('localStorage.getItem error:', e);
            return null;
        }
    },

    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.error('localStorage.setItem error:', e);
            return false;
        }
    },

    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('localStorage.removeItem error:', e);
            return false;
        }
    }
};

/**
 * Statistics Tracker with localStorage and comprehensive error handling
 */
class Statistics {
    constructor() {
        this.loadStats();
    }

    loadStats() {
        try {
            const saved = SafeStorage.getItem('blackjack_stats');
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(this, this.validateStats(parsed));
            } else {
                this.reset();
            }
        } catch (e) {
            console.error('Error loading stats:', e);
            this.reset();
        }
    }

    validateStats(stats) {
        // Ensure all stats are valid numbers
        return {
            handsPlayed: Number(stats.handsPlayed) || 0,
            wins: Number(stats.wins) || 0,
            losses: Number(stats.losses) || 0,
            pushes: Number(stats.pushes) || 0,
            blackjacks: Number(stats.blackjacks) || 0,
            biggestWin: Number(stats.biggestWin) || 0,
            totalWagered: Number(stats.totalWagered) || 0,
            luckyPairWins: Number(stats.luckyPairWins) || 0,
            twentyOnePlusWins: Number(stats.twentyOnePlusWins) || 0,
            top3Wins: Number(stats.top3Wins) || 0,
            bonusWinnings: Number(stats.bonusWinnings) || 0
        };
    }

    saveStats() {
        try {
            SafeStorage.setItem('blackjack_stats', JSON.stringify({
                handsPlayed: this.handsPlayed,
                wins: this.wins,
                losses: this.losses,
                pushes: this.pushes,
                blackjacks: this.blackjacks,
                biggestWin: this.biggestWin,
                totalWagered: this.totalWagered,
                luckyPairWins: this.luckyPairWins,
                twentyOnePlusWins: this.twentyOnePlusWins,
                top3Wins: this.top3Wins,
                bonusWinnings: this.bonusWinnings
            }));
        } catch (e) {
            console.error('Error saving stats:', e);
        }
    }

    recordHand(result, amount) {
        try {
            this.handsPlayed++;
            this.totalWagered += amount;

            switch (result) {
                case 'win':
                    this.wins++;
                    if (amount > this.biggestWin) this.biggestWin = amount;
                    break;
                case 'lose':
                    this.losses++;
                    break;
                case 'push':
                    this.pushes++;
                    break;
                case 'blackjack':
                    this.wins++;
                    this.blackjacks++;
                    const winAmount = Math.floor(amount * 1.5);
                    if (winAmount > this.biggestWin) this.biggestWin = winAmount;
                    break;
            }

            this.saveStats();
            trackEvent('Game', 'Hand', result, amount);
        } catch (e) {
            console.error('Error recording hand:', e);
        }
    }

    getWinRate() {
        const totalDecisive = this.wins + this.losses;
        return totalDecisive > 0 ? Math.round((this.wins / totalDecisive) * 100) : 0;
    }

    reset() {
        this.handsPlayed = 0;
        this.wins = 0;
        this.losses = 0;
        this.pushes = 0;
        this.blackjacks = 0;
        this.biggestWin = 0;
        this.totalWagered = 0;
        this.luckyPairWins = 0;
        this.twentyOnePlusWins = 0;
        this.top3Wins = 0;
        this.bonusWinnings = 0;
        this.saveStats();
        trackEvent('Settings', 'ResetStats', 'Statistics Reset');
    }

    recordBonus(bonusType, amount) {
        try {
            switch (bonusType) {
                case 'luckyPair':
                    this.luckyPairWins++;
                    break;
                case 'twentyOnePlus':
                    this.twentyOnePlusWins++;
                    break;
                case 'top3':
                    this.top3Wins++;
                    break;
            }
            this.bonusWinnings += amount;
            this.saveStats();
            trackEvent('Bonus', bonusType, 'Won', amount);
        } catch (e) {
            console.error('Error recording bonus:', e);
        }
    }
}

/**
 * Settings Manager with localStorage and validation
 */
class Settings {
    constructor() {
        this.loadSettings();
    }

    loadSettings() {
        try {
            const saved = SafeStorage.getItem('blackjack_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(this, this.validateSettings(parsed));
            } else {
                this.setDefaults();
            }
        } catch (e) {
            console.error('Error loading settings:', e);
            this.setDefaults();
        }
    }

    validateSettings(settings) {
        return {
            soundEnabled: Boolean(settings.soundEnabled ?? true),
            hintsEnabled: Boolean(settings.hintsEnabled ?? false),
            animationsEnabled: Boolean(settings.animationsEnabled ?? true),
            autoStandOn21: Boolean(settings.autoStandOn21 ?? true)
        };
    }

    setDefaults() {
        this.soundEnabled = true;
        this.hintsEnabled = false;
        this.animationsEnabled = true;
        this.autoStandOn21 = true;
    }

    saveSettings() {
        try {
            SafeStorage.setItem('blackjack_settings', JSON.stringify({
                soundEnabled: this.soundEnabled,
                hintsEnabled: this.hintsEnabled,
                animationsEnabled: this.animationsEnabled,
                autoStandOn21: this.autoStandOn21
            }));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    }

    toggle(setting) {
        if (this.hasOwnProperty(setting)) {
            this[setting] = !this[setting];
            this.saveSettings();
            trackEvent('Settings', 'Toggle', setting, this[setting] ? 1 : 0);
            return this[setting];
        }
        return false;
    }
}

/**
 * Sound Manager using Web Audio API with comprehensive error handling
 */
class SoundManager {
    constructor() {
        this.context = null;
        this.enabled = true;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                console.warn('Web Audio API not supported');
                return;
            }

            this.context = new AudioContext();
            this.initialized = true;
        } catch (e) {
            console.error('Error initializing audio:', e);
        }
    }

    beep(frequency = 440, duration = 100, volume = 0.1) {
        if (!this.enabled || !this.context || !this.initialized) return;

        try {
            // Resume context if suspended (needed for mobile browsers)
            if (this.context.state === 'suspended') {
                this.context.resume();
            }

            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            gainNode.gain.value = Math.max(0, Math.min(1, volume));
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            const currentTime = this.context.currentTime;
            oscillator.start(currentTime);
            oscillator.stop(currentTime + duration / 1000);
        } catch (e) {
            console.error('Error playing sound:', e);
        }
    }

    cardDeal() { this.beep(392, 50, 0.05); }
    chipBet() { this.beep(523, 80, 0.08); }
    win() { this.beep(659, 200, 0.12); }
    lose() { this.beep(220, 300, 0.10); }
    blackjack() {
        this.beep(523, 100, 0.10);
        setTimeout(() => this.beep(659, 100, 0.10), 120);
        setTimeout(() => this.beep(784, 200, 0.12), 240);
    }
    click() { this.beep(600, 30, 0.05); }

    setEnabled(enabled) {
        this.enabled = Boolean(enabled);
    }
}

/**
 * Card class representing a playing card
 */
class Card {
    constructor(suit, value) {
        if (!suit || !value) {
            throw new Error('Invalid card: suit and value required');
        }
        this.suit = suit;
        this.value = value;
    }

    get numericValue() {
        if (this.value === 'A') return 11;
        if (['K', 'Q', 'J'].includes(this.value)) return 10;
        const parsed = parseInt(this.value);
        return isNaN(parsed) ? 0 : parsed;
    }

    get displayValue() {
        return this.value + this.suit;
    }
}

/**
 * Deck class with multiple deck support and proper shuffling
 */
class Deck {
    constructor(numberOfDecks = 1) {
        this.numberOfDecks = Math.max(1, Math.min(8, Number(numberOfDecks) || 1));
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
        // Fisher-Yates shuffle algorithm
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        this.needsShuffle = false;
        trackEvent('Game', 'Shuffle', 'Deck Shuffled');
    }

    draw() {
        // Check if we need to shuffle (but don't shuffle mid-hand)
        if (this.cards.length <= this.shuffleThreshold && !this.needsShuffle) {
            this.needsShuffle = true;
        }

        // If completely out of cards (safety check), force reset
        if (this.cards.length === 0) {
            console.warn('Deck exhausted, resetting');
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

/**
 * Main Blackjack Game class with full production features
 */
class BlackjackGame {
    constructor() {
        // Game state
        this.playerHand = [];
        this.dealerHand = [];
        this.chips = 1000;
        this.currentBet = 0;
        this.insuranceBet = 0;
        this.gameActive = false;
        this.dealerHidden = false;
        this.canSurrender = true;
        this.hasInsurance = false;
        this.roundInProgress = false;

        // Side bets
        this.luckyPairBet = 0;
        this.twentyOnePlusBet = 0;
        this.top3Bet = 0;
        this.sideBetAmount = 5;

        // Initialize systems
        try {
            this.stats = new Statistics();
            this.settings = new Settings();
            this.sound = new SoundManager();
        } catch (e) {
            console.error('Error initializing game systems:', e);
            trackError(e);
        }

        // Initialize UI
        this.initializeElements();
        this.initializeDeck();
        this.attachEventListeners();
        this.loadSettings();
        this.updateDisplay();
        this.updateStatsDisplay();

        // Track page load
        trackEvent('Game', 'Load', 'Game Initialized');
    }

    /**
     * Initialize all DOM elements with null checks
     */
    initializeElements() {
        try {
            // UI Elements
            this.chipsDisplay = this.getElement('chips');
            this.betDisplay = this.getElement('current-bet');
            this.cardsRemainingDisplay = this.getElement('cards-remaining');
            this.winRateDisplay = this.getElement('win-rate');
            this.playerCardsEl = this.getElement('player-cards');
            this.dealerCardsEl = this.getElement('dealer-cards');
            this.playerScoreEl = this.getElement('player-score');
            this.dealerScoreEl = this.getElement('dealer-score');
            this.messageEl = this.getElement('message');

            // Control sections
            this.bettingControls = this.getElement('betting-controls');
            this.gameControls = this.getElement('game-controls');
            this.insuranceControls = this.getElement('insurance-controls');
            this.newGameControls = this.getElement('new-game-controls');
            this.strategyHint = this.getElement('strategy-hint');
            this.hintText = this.getElement('hint-text');

            // Buttons
            this.dealBtn = this.getElement('deal-btn');
            this.hitBtn = this.getElement('hit-btn');
            this.standBtn = this.getElement('stand-btn');
            this.doubleBtn = this.getElement('double-btn');
            this.splitBtn = this.getElement('split-btn');
            this.surrenderBtn = this.getElement('surrender-btn');
            this.insuranceYesBtn = this.getElement('insurance-yes-btn');
            this.insuranceNoBtn = this.getElement('insurance-no-btn');
            this.newGameBtn = this.getElement('new-game-btn');
            this.betButtons = document.querySelectorAll('.bet-btn');

            // Modal elements
            this.statsBtn = this.getElement('stats-btn');
            this.settingsBtn = this.getElement('settings-btn');
            this.statsModal = this.getElement('stats-modal');
            this.settingsModal = this.getElement('settings-modal');
            this.resetStatsBtn = this.getElement('reset-stats-btn');

            // Settings toggles
            this.soundToggle = this.getElement('sound-toggle');
            this.hintsToggle = this.getElement('hints-toggle');
            this.animationsToggle = this.getElement('animations-toggle');
            this.autoStandToggle = this.getElement('auto-stand-toggle');

            // Deck selector
            this.deckCountSelect = this.getElement('deck-count');

            // Side bet checkboxes
            this.luckyPairCheckbox = this.getElement('lucky-pair-bet');
            this.twentyOnePlusCheckbox = this.getElement('twentyone-plus-bet');
            this.top3Checkbox = this.getElement('top3-bet');

            // Close buttons
            document.querySelectorAll('.close-btn').forEach(btn => {
                btn.onclick = () => this.closeModal(btn.dataset.modal);
            });

            // Click outside modal to close
            [this.statsModal, this.settingsModal].forEach(modal => {
                if (modal) {
                    modal.onclick = (e) => {
                        if (e.target === modal) this.closeModal(modal.id);
                    };
                }
            });
        } catch (e) {
            console.error('Error initializing elements:', e);
            trackError(e);
        }
    }

    /**
     * Safe element getter with error handling
     */
    getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element not found: ${id}`);
        }
        return element;
    }

    /**
     * Initialize deck with selected count
     */
    initializeDeck() {
        try {
            const deckCount = parseInt(this.deckCountSelect?.value || 4);
            this.deck = new Deck(deckCount);
        } catch (e) {
            console.error('Error initializing deck:', e);
            this.deck = new Deck(4); // Fallback to 4 decks
        }
    }

    /**
     * Attach all event listeners with error boundaries
     */
    attachEventListeners() {
        try {
            // Bet buttons
            this.betButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const amount = parseInt(btn.dataset.amount);
                    if (!isNaN(amount)) {
                        this.placeBet(amount);
                    }
                });
            });

            // Game action buttons
            this.dealBtn?.addEventListener('click', () => this.deal());
            this.hitBtn?.addEventListener('click', () => this.hit());
            this.standBtn?.addEventListener('click', () => this.stand());
            this.doubleBtn?.addEventListener('click', () => this.doubleDown());
            this.surrenderBtn?.addEventListener('click', () => this.surrender());
            this.newGameBtn?.addEventListener('click', () => this.resetGame());

            // Insurance buttons
            this.insuranceYesBtn?.addEventListener('click', () => this.takeInsurance());
            this.insuranceNoBtn?.addEventListener('click', () => this.declineInsurance());

            // Deck count change
            this.deckCountSelect?.addEventListener('change', () => {
                if (!this.gameActive && !this.roundInProgress) {
                    this.initializeDeck();
                    this.updateDisplay();
                    this.showMessage(`Deck changed to ${this.deckCountSelect.value} deck(s)`, 'info');
                }
            });

            // Side bet checkboxes
            this.luckyPairCheckbox?.addEventListener('change', (e) => {
                this.updateSideBets();
            });
            this.twentyOnePlusCheckbox?.addEventListener('change', (e) => {
                this.updateSideBets();
            });
            this.top3Checkbox?.addEventListener('change', (e) => {
                this.updateSideBets();
            });

            // Modal buttons
            this.statsBtn?.addEventListener('click', () => this.openModal('stats-modal'));
            this.settingsBtn?.addEventListener('click', () => this.openModal('settings-modal'));
            this.resetStatsBtn?.addEventListener('click', () => this.confirmResetStats());

            // Settings toggles
            this.soundToggle?.addEventListener('change', (e) => {
                this.settings.soundEnabled = e.target.checked;
                this.sound.setEnabled(e.target.checked);
                this.settings.saveSettings();
            });

            this.hintsToggle?.addEventListener('change', (e) => {
                this.settings.hintsEnabled = e.target.checked;
                this.settings.saveSettings();
                this.updateStrategyHint();
            });

            this.animationsToggle?.addEventListener('change', (e) => {
                this.settings.animationsEnabled = e.target.checked;
                document.body.classList.toggle('no-animations', !e.target.checked);
                this.settings.saveSettings();
            });

            this.autoStandToggle?.addEventListener('change', (e) => {
                this.settings.autoStandOn21 = e.target.checked;
                this.settings.saveSettings();
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));

            // Initialize sound on first user interaction
            document.addEventListener('click', () => {
                if (!this.sound.initialized) {
                    this.sound.init();
                }
            }, { once: true });

        } catch (e) {
            console.error('Error attaching event listeners:', e);
            trackError(e);
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

        switch (e.key.toLowerCase()) {
            case 'h':
                if (this.gameActive && !this.hitBtn?.disabled) this.hit();
                break;
            case 's':
                if (this.gameActive && !this.standBtn?.disabled) this.stand();
                break;
            case 'd':
                if (this.gameActive && !this.doubleBtn?.disabled) this.doubleDown();
                break;
            case 'escape':
                this.closeAllModals();
                break;
        }
    }

    /**
     * Place a bet with validation
     */
    placeBet(amount) {
        if (this.gameActive || this.roundInProgress) return;

        try {
            const betAmount = Number(amount);
            if (isNaN(betAmount) || betAmount <= 0) {
                this.showMessage('Invalid bet amount!', 'error');
                return;
            }

            if (betAmount > this.chips) {
                this.showMessage('Not enough chips!', 'error');
                this.sound.lose();
                return;
            }

            this.currentBet = betAmount;
            this.dealBtn.disabled = false;
            this.updateDisplay();
            this.showMessage(`Bet placed: $${betAmount}`, 'info');

            if (this.settings.soundEnabled) {
                this.sound.chipBet();
            }

            trackEvent('Game', 'Bet', 'Bet Placed', betAmount);
        } catch (e) {
            console.error('Error placing bet:', e);
            this.showMessage('Error placing bet', 'error');
        }
    }

    /**
     * Update side bet amounts based on checkboxes
     */
    updateSideBets() {
        if (this.gameActive || this.roundInProgress) return;

        try {
            this.luckyPairBet = this.luckyPairCheckbox?.checked ? this.sideBetAmount : 0;
            this.twentyOnePlusBet = this.twentyOnePlusCheckbox?.checked ? this.sideBetAmount : 0;
            this.top3Bet = this.top3Checkbox?.checked ? this.sideBetAmount : 0;

            const totalSideBets = this.luckyPairBet + this.twentyOnePlusBet + this.top3Bet;

            // Check if enough chips for side bets
            if (totalSideBets > 0 && totalSideBets + this.currentBet > this.chips) {
                this.showMessage('Not enough chips for all bets!', 'error');
                // Uncheck the last checked box
                if (this.luckyPairCheckbox?.checked && this.luckyPairBet > 0) {
                    this.luckyPairCheckbox.checked = false;
                    this.luckyPairBet = 0;
                } else if (this.twentyOnePlusCheckbox?.checked && this.twentyOnePlusBet > 0) {
                    this.twentyOnePlusCheckbox.checked = false;
                    this.twentyOnePlusBet = 0;
                } else if (this.top3Checkbox?.checked && this.top3Bet > 0) {
                    this.top3Checkbox.checked = false;
                    this.top3Bet = 0;
                }
                return;
            }

            trackEvent('Game', 'SideBets', 'Updated', totalSideBets);
        } catch (e) {
            console.error('Error updating side bets:', e);
        }
    }

    /**
     * Get card color (red or black)
     */
    getCardColor(card) {
        return (card.suit === '♥️' || card.suit === '♦️') ? 'red' : 'black';
    }

    /**
     * Get numeric rank value for poker hand evaluation
     */
    getRankValue(card) {
        const rankMap = {
            'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
            '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
        };
        return rankMap[card.value] || 0;
    }

    /**
     * Evaluate Lucky Pair bonus (Perfect Pairs)
     */
    evaluateLuckyPair() {
        if (this.luckyPairBet === 0 || this.playerHand.length < 2) return null;

        const card1 = this.playerHand[0];
        const card2 = this.playerHand[1];

        // Check if same rank
        if (card1.value !== card2.value) return null;

        // Perfect Pair - same rank and suit (shouldn't happen in multi-deck, but check anyway)
        if (card1.suit === card2.suit) {
            return { name: 'Perfect Pair', payout: 25 };
        }

        // Colored Pair - same rank and color
        if (this.getCardColor(card1) === this.getCardColor(card2)) {
            return { name: 'Colored Pair', payout: 12 };
        }

        // Mixed Pair - same rank, different colors
        return { name: 'Mixed Pair', payout: 6 };
    }

    /**
     * Check if three cards form a straight
     */
    isStraight(cards) {
        const ranks = cards.map(c => this.getRankValue(c)).sort((a, b) => a - b);

        // Regular straight
        if (ranks[1] === ranks[0] + 1 && ranks[2] === ranks[1] + 1) {
            return true;
        }

        // Ace-high straight (Q-K-A or K-A-2, etc)
        if (ranks[0] === 1) { // Ace
            const highRanks = [14, ranks[1], ranks[2]].sort((a, b) => a - b);
            if (highRanks[1] === highRanks[0] + 1 && highRanks[2] === highRanks[1] + 1) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if three cards form a flush
     */
    isFlush(cards) {
        return cards[0].suit === cards[1].suit && cards[1].suit === cards[2].suit;
    }

    /**
     * Check if three cards are three of a kind
     */
    isThreeOfKind(cards) {
        return cards[0].value === cards[1].value && cards[1].value === cards[2].value;
    }

    /**
     * Evaluate 21+3 bonus
     */
    evaluate21Plus3() {
        if (this.twentyOnePlusBet === 0 || this.playerHand.length < 2 || this.dealerHand.length < 2) {
            return null;
        }

        const cards = [this.playerHand[0], this.playerHand[1], this.dealerHand[1]];

        // Suited Three of a Kind
        if (this.isThreeOfKind(cards) && this.isFlush(cards)) {
            return { name: 'Suited Three of a Kind', payout: 100 };
        }

        // Straight Flush
        if (this.isStraight(cards) && this.isFlush(cards)) {
            return { name: 'Straight Flush', payout: 40 };
        }

        // Three of a Kind
        if (this.isThreeOfKind(cards)) {
            return { name: 'Three of a Kind', payout: 30 };
        }

        // Straight
        if (this.isStraight(cards)) {
            return { name: 'Straight', payout: 10 };
        }

        // Flush
        if (this.isFlush(cards)) {
            return { name: 'Flush', payout: 5 };
        }

        return null;
    }

    /**
     * Evaluate Top 3 bonus
     */
    evaluateTop3() {
        if (this.top3Bet === 0 || this.playerHand.length < 2 || this.dealerHand.length < 2) {
            return null;
        }

        const cards = [this.playerHand[0], this.playerHand[1], this.dealerHand[1]];

        // Suited Three of a Kind
        if (this.isThreeOfKind(cards) && this.isFlush(cards)) {
            return { name: 'Suited Three of a Kind', payout: 270 };
        }

        // Straight Flush
        if (this.isStraight(cards) && this.isFlush(cards)) {
            return { name: 'Straight Flush', payout: 180 };
        }

        // Three of a Kind
        if (this.isThreeOfKind(cards)) {
            return { name: 'Three of a Kind', payout: 90 };
        }

        // Straight
        if (this.isStraight(cards)) {
            return { name: 'Straight', payout: 9 };
        }

        // Flush
        if (this.isFlush(cards)) {
            return { name: 'Flush', payout: 9 };
        }

        return null;
    }

    /**
     * Evaluate and pay all bonuses
     */
    evaluateAndPayBonuses() {
        let bonusMessages = [];
        let totalBonusWinnings = 0;

        try {
            // Lucky Pair
            const luckyPairResult = this.evaluateLuckyPair();
            if (luckyPairResult) {
                const winAmount = this.luckyPairBet * luckyPairResult.payout;
                this.chips += winAmount;
                totalBonusWinnings += winAmount;
                bonusMessages.push(`Lucky Pair (${luckyPairResult.name}): +$${winAmount}`);
                this.stats.recordBonus('luckyPair', winAmount);
                if (this.settings.soundEnabled) this.sound.win();
            }

            // 21+3
            const twentyOnePlusResult = this.evaluate21Plus3();
            if (twentyOnePlusResult) {
                const winAmount = this.twentyOnePlusBet * twentyOnePlusResult.payout;
                this.chips += winAmount;
                totalBonusWinnings += winAmount;
                bonusMessages.push(`21+3 (${twentyOnePlusResult.name}): +$${winAmount}`);
                this.stats.recordBonus('twentyOnePlus', winAmount);
                if (this.settings.soundEnabled) this.sound.win();
            }

            // Top 3
            const top3Result = this.evaluateTop3();
            if (top3Result) {
                const winAmount = this.top3Bet * top3Result.payout;
                this.chips += winAmount;
                totalBonusWinnings += winAmount;
                bonusMessages.push(`Top 3 (${top3Result.name}): +$${winAmount}`);
                this.stats.recordBonus('top3', winAmount);
                if (this.settings.soundEnabled) this.sound.win();
            }

            // Display bonus results
            if (bonusMessages.length > 0) {
                const message = '🎰 BONUS WIN! ' + bonusMessages.join(' | ');
                this.showMessage(message, 'win');
                setTimeout(() => {
                    this.showMessage('Continue playing...', 'info');
                }, 3000);
            }
        } catch (e) {
            console.error('Error evaluating bonuses:', e);
        }
    }

    /**
     * Deal initial cards
     */
    deal() {
        if (this.currentBet === 0 || this.currentBet > this.chips) return;

        // Check if enough chips for main bet + side bets
        const totalBets = this.currentBet + this.luckyPairBet + this.twentyOnePlusBet + this.top3Bet;
        if (totalBets > this.chips) {
            this.showMessage('Not enough chips for all bets!', 'error');
            return;
        }

        try {
            // Deduct side bets from chips
            this.chips -= (this.luckyPairBet + this.twentyOnePlusBet + this.top3Bet);

            this.gameActive = true;
            this.roundInProgress = true;
            this.dealerHidden = true;
            this.canSurrender = true;
            this.hasInsurance = false;
            this.insuranceBet = 0;
            this.playerHand = [];
            this.dealerHand = [];

            // Deal initial cards with animation delay
            const dealCard = (hand, delay) => {
                setTimeout(() => {
                    hand.push(this.deck.draw());
                    if (this.settings.soundEnabled) this.sound.cardDeal();
                    this.updateDisplay();
                }, delay);
            };

            dealCard(this.playerHand, 100);
            dealCard(this.dealerHand, 300);
            dealCard(this.playerHand, 500);
            dealCard(this.dealerHand, 700);

            setTimeout(() => {
                this.showControls('game');
                this.updateDisplay();

                // Evaluate bonuses after cards are dealt
                this.evaluateAndPayBonuses();

                // Update display after bonuses are paid
                this.updateDisplay();
                this.updateStatsDisplay();

                this.checkInitialConditions();
                this.updateStrategyHint();
            }, 900);

            trackEvent('Game', 'Deal', 'Cards Dealt');
        } catch (e) {
            console.error('Error dealing cards:', e);
            this.showMessage('Error dealing cards', 'error');
            this.resetGame();
        }
    }

    /**
     * Check for blackjack and insurance options
     */
    checkInitialConditions() {
        try {
            const playerValue = this.getHandValue(this.playerHand);
            const dealerUpCard = this.dealerHand[1];

            // Check for insurance offer
            if (dealerUpCard?.value === 'A' && !this.hasInsurance) {
                this.offerInsurance();
                return;
            }

            // Check for blackjack
            if (playerValue === 21) {
                this.dealerHidden = false;
                this.updateDisplay();

                const dealerValue = this.getHandValue(this.dealerHand);
                if (dealerValue === 21) {
                    this.endGame('push', 'Both have Blackjack! Push.');
                } else {
                    this.endGame('blackjack', '🎉 Blackjack! You win!');
                }
            }
        } catch (e) {
            console.error('Error checking initial conditions:', e);
        }
    }

    /**
     * Offer insurance
     */
    offerInsurance() {
        if (this.currentBet / 2 > this.chips - this.currentBet) {
            // Not enough chips for insurance
            return;
        }

        this.showControls('insurance');
        this.showMessage('Insurance available - Dealer shows Ace', 'info');
    }

    /**
     * Take insurance
     */
    takeInsurance() {
        try {
            this.insuranceBet = Math.floor(this.currentBet / 2);
            this.hasInsurance = true;
            this.showControls('game');
            this.showMessage('Insurance taken', 'info');

            // Check for dealer blackjack
            if (this.getHandValue(this.dealerHand) === 21) {
                this.dealerHidden = false;
                this.updateDisplay();
                this.chips += this.insuranceBet * 2; // Insurance pays 2:1
                this.showMessage('Dealer has Blackjack! Insurance pays 2:1', 'push');
                setTimeout(() => this.endGame('lose', 'Dealer Blackjack - Insurance paid'), 1500);
            }

            trackEvent('Game', 'Insurance', 'Taken', this.insuranceBet);
        } catch (e) {
            console.error('Error taking insurance:', e);
        }
    }

    /**
     * Decline insurance
     */
    declineInsurance() {
        this.showControls('game');
        this.showMessage('Insurance declined', 'info');

        // Check for dealer blackjack
        if (this.getHandValue(this.dealerHand) === 21) {
            this.dealerHidden = false;
            this.updateDisplay();
            this.endGame('lose', 'Dealer has Blackjack!');
        }

        trackEvent('Game', 'Insurance', 'Declined');
    }

    /**
     * Hit - take another card
     */
    hit() {
        if (!this.gameActive) return;

        try {
            this.canSurrender = false; // Can't surrender after first action
            this.playerHand.push(this.deck.draw());

            if (this.settings.soundEnabled) {
                this.sound.cardDeal();
            }

            this.updateDisplay();
            this.updateStrategyHint();

            const playerValue = this.getHandValue(this.playerHand);

            if (playerValue > 21) {
                this.dealerHidden = false;
                this.updateDisplay();
                this.endGame('lose', '💥 Bust! You lose.');
            } else if (playerValue === 21 && this.settings.autoStandOn21) {
                this.stand();
            }

            trackEvent('Game', 'Action', 'Hit');
        } catch (e) {
            console.error('Error hitting:', e);
            this.showMessage('Error taking card', 'error');
        }
    }

    /**
     * Stand - keep current hand
     */
    stand() {
        if (!this.gameActive) return;

        try {
            this.gameActive = false;
            this.dealerHidden = false;

            // Dealer draws until 17 or higher
            while (this.getHandValue(this.dealerHand) < 17) {
                this.dealerHand.push(this.deck.draw());

                if (this.settings.soundEnabled) {
                    this.sound.cardDeal();
                }
            }

            this.updateDisplay();
            setTimeout(() => this.determineWinner(), 500);

            trackEvent('Game', 'Action', 'Stand');
        } catch (e) {
            console.error('Error standing:', e);
            this.showMessage('Error processing stand', 'error');
        }
    }

    /**
     * Double down - double bet and take one card
     */
    doubleDown() {
        if (!this.gameActive || this.playerHand.length !== 2 || this.currentBet * 2 > this.chips) {
            return;
        }

        try {
            this.currentBet *= 2;
            this.canSurrender = false;
            this.updateDisplay();

            this.hit();

            if (this.gameActive) {
                this.stand();
            }

            trackEvent('Game', 'Action', 'Double Down');
        } catch (e) {
            console.error('Error doubling down:', e);
        }
    }

    /**
     * Surrender - forfeit half bet
     */
    surrender() {
        if (!this.gameActive || !this.canSurrender) return;

        try {
            this.gameActive = false;
            this.roundInProgress = false;
            this.chips -= Math.floor(this.currentBet / 2);
            this.showMessage('Surrendered - Half bet returned', 'info');
            this.showControls('new');
            this.updateDisplay();

            trackEvent('Game', 'Action', 'Surrender');
        } catch (e) {
            console.error('Error surrendering:', e);
        }
    }

    /**
     * Determine winner and update chips
     */
    determineWinner() {
        try {
            const playerValue = this.getHandValue(this.playerHand);
            const dealerValue = this.getHandValue(this.dealerHand);

            if (dealerValue > 21) {
                this.endGame('win', '🎉 Dealer busts! You win!');
            } else if (playerValue > dealerValue) {
                this.endGame('win', '🎉 You win!');
            } else if (playerValue < dealerValue) {
                this.endGame('lose', '😞 Dealer wins!');
            } else {
                this.endGame('push', '🤝 Push! It\'s a tie.');
            }
        } catch (e) {
            console.error('Error determining winner:', e);
            this.endGame('push', 'Error determining winner');
        }
    }

    /**
     * End game and update chips/stats
     */
    endGame(result, message) {
        this.gameActive = false;
        this.roundInProgress = false;

        try {
            // Play appropriate sound
            if (this.settings.soundEnabled) {
                switch (result) {
                    case 'blackjack':
                        this.sound.blackjack();
                        break;
                    case 'win':
                        this.sound.win();
                        break;
                    case 'lose':
                        this.sound.lose();
                        break;
                }
            }

            // Update chips
            switch (result) {
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

            // Record statistics
            this.stats.recordHand(result, this.currentBet);
            this.updateStatsDisplay();

            // Check if shuffle is needed
            if (this.deck.shouldShuffle()) {
                message += ' | 🔄 Shuffling deck...';
                setTimeout(() => {
                    this.deck.reset();
                    this.updateDisplay();
                    this.showMessage('Deck shuffled! Fresh shoe.', 'info');
                }, 2000);
            }

            this.showMessage(message, result);
            this.showControls('new');
            this.updateDisplay();

            // Check for game over
            if (this.chips <= 0) {
                this.showMessage('💸 Game Over! No more chips. Resetting...', 'error');
                setTimeout(() => {
                    this.chips = 1000;
                    this.resetGame();
                }, 3000);
                trackEvent('Game', 'GameOver', 'Bankrupt');
            }
        } catch (e) {
            console.error('Error ending game:', e);
            trackError(e);
        }
    }

    /**
     * Reset for new round
     */
    resetGame() {
        try {
            this.currentBet = 0;
            this.insuranceBet = 0;
            this.hasInsurance = false;
            this.canSurrender = true;
            this.gameActive = false;
            this.roundInProgress = false;

            // Reset side bets
            this.luckyPairBet = 0;
            this.twentyOnePlusBet = 0;
            this.top3Bet = 0;
            if (this.luckyPairCheckbox) this.luckyPairCheckbox.checked = false;
            if (this.twentyOnePlusCheckbox) this.twentyOnePlusCheckbox.checked = false;
            if (this.top3Checkbox) this.top3Checkbox.checked = false;

            this.dealBtn.disabled = true;
            this.showControls('betting');
            this.playerHand = [];
            this.dealerHand = [];
            this.updateDisplay();
            this.hideStrategyHint();
            this.showMessage('Place your bet to start a new round', 'info');
        } catch (e) {
            console.error('Error resetting game:', e);
        }
    }

    /**
     * Calculate hand value with ace adjustment
     */
    getHandValue(hand) {
        if (!Array.isArray(hand)) return 0;

        let value = 0;
        let aces = 0;

        for (let card of hand) {
            if (!card) continue;
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

    /**
     * Show/hide control sections
     */
    showControls(type) {
        this.bettingControls?.classList.add('hidden');
        this.gameControls?.classList.add('hidden');
        this.insuranceControls?.classList.add('hidden');
        this.newGameControls?.classList.add('hidden');

        switch (type) {
            case 'betting':
                this.bettingControls?.classList.remove('hidden');
                break;
            case 'game':
                this.gameControls?.classList.remove('hidden');
                break;
            case 'insurance':
                this.insuranceControls?.classList.remove('hidden');
                break;
            case 'new':
                this.newGameControls?.classList.remove('hidden');
                break;
        }
    }

    /**
     * Show message with type styling
     */
    showMessage(text, type) {
        if (!this.messageEl) return;

        this.messageEl.textContent = text;
        this.messageEl.className = `message ${type}`;
    }

    /**
     * Update all display elements
     */
    updateDisplay() {
        try {
            // Update chips, bet, and cards remaining
            if (this.chipsDisplay) this.chipsDisplay.textContent = this.chips;
            if (this.betDisplay) this.betDisplay.textContent = this.currentBet;
            if (this.cardsRemainingDisplay) {
                this.cardsRemainingDisplay.textContent = this.deck.getCardsRemaining();

                // Add warning color if running low on cards
                if (this.deck.shouldShuffle()) {
                    this.cardsRemainingDisplay.style.color = '#ff5722';
                } else {
                    this.cardsRemainingDisplay.style.color = '';
                }
            }

            // Update player cards
            if (this.playerCardsEl) {
                this.playerCardsEl.innerHTML = this.playerHand
                    .map(card => `<div class="card" role="img" aria-label="${card.displayValue}">${card.displayValue}</div>`)
                    .join('');
            }

            // Update dealer cards
            if (this.dealerCardsEl) {
                if (this.dealerHidden && this.dealerHand.length > 0) {
                    this.dealerCardsEl.innerHTML =
                        `<div class="card" role="img" aria-label="Hidden card">🂠</div>` +
                        this.dealerHand.slice(1)
                            .map(card => `<div class="card" role="img" aria-label="${card.displayValue}">${card.displayValue}</div>`)
                            .join('');
                } else {
                    this.dealerCardsEl.innerHTML = this.dealerHand
                        .map(card => `<div class="card" role="img" aria-label="${card.displayValue}">${card.displayValue}</div>`)
                        .join('');
                }
            }

            // Update scores
            if (this.playerScoreEl) {
                this.playerScoreEl.textContent = this.playerHand.length > 0
                    ? `(${this.getHandValue(this.playerHand)})`
                    : '';
            }

            if (this.dealerScoreEl) {
                this.dealerScoreEl.textContent = (this.dealerHand.length > 0 && !this.dealerHidden)
                    ? `(${this.getHandValue(this.dealerHand)})`
                    : '';
            }

            // Enable/disable buttons based on game state
            if (this.doubleBtn) {
                this.doubleBtn.disabled = this.playerHand.length !== 2 ||
                                         this.currentBet * 2 > this.chips;
            }

            if (this.surrenderBtn) {
                this.surrenderBtn.disabled = !this.canSurrender;
            }
        } catch (e) {
            console.error('Error updating display:', e);
        }
    }

    /**
     * Update statistics display
     */
    updateStatsDisplay() {
        try {
            // Update win rate in header
            if (this.winRateDisplay) {
                const winRate = this.stats.getWinRate();
                this.winRateDisplay.textContent = winRate > 0 ? `${winRate}%` : '--';
            }

            // Update modal stats
            const statElements = {
                'stat-hands': this.stats.handsPlayed,
                'stat-wins': this.stats.wins,
                'stat-losses': this.stats.losses,
                'stat-pushes': this.stats.pushes,
                'stat-blackjacks': this.stats.blackjacks,
                'stat-winrate': `${this.stats.getWinRate()}%`,
                'stat-bigwin': `$${this.stats.biggestWin}`,
                'stat-wagered': `$${this.stats.totalWagered}`,
                'stat-lucky-pair-wins': this.stats.luckyPairWins,
                'stat-twentyone-plus-wins': this.stats.twentyOnePlusWins,
                'stat-top3-wins': this.stats.top3Wins,
                'stat-bonus-winnings': `$${this.stats.bonusWinnings}`
            };

            for (const [id, value] of Object.entries(statElements)) {
                const element = document.getElementById(id);
                if (element) element.textContent = value;
            }
        } catch (e) {
            console.error('Error updating stats display:', e);
        }
    }

    /**
     * Update strategy hint based on basic strategy
     */
    updateStrategyHint() {
        if (!this.settings.hintsEnabled || !this.gameActive) {
            this.hideStrategyHint();
            return;
        }

        try {
            const playerValue = this.getHandValue(this.playerHand);
            const dealerUpCard = this.dealerHand[1];
            if (!dealerUpCard) return;

            const dealerValue = dealerUpCard.numericValue;
            let hint = '';

            // Basic strategy hints (simplified)
            if (playerValue <= 11) {
                hint = '💡 Hint: Hit';
            } else if (playerValue === 12) {
                hint = dealerValue >= 4 && dealerValue <= 6 ? '💡 Hint: Stand' : '💡 Hint: Hit';
            } else if (playerValue >= 13 && playerValue <= 16) {
                hint = dealerValue >= 2 && dealerValue <= 6 ? '💡 Hint: Stand' : '💡 Hint: Hit';
            } else if (playerValue >= 17) {
                hint = '💡 Hint: Stand';
            }

            if (hint && this.hintText) {
                this.hintText.textContent = hint;
                this.strategyHint?.classList.remove('hidden');
            }
        } catch (e) {
            console.error('Error updating strategy hint:', e);
        }
    }

    /**
     * Hide strategy hint
     */
    hideStrategyHint() {
        this.strategyHint?.classList.add('hidden');
    }

    /**
     * Load settings from storage and apply
     */
    loadSettings() {
        try {
            if (this.soundToggle) this.soundToggle.checked = this.settings.soundEnabled;
            if (this.hintsToggle) this.hintsToggle.checked = this.settings.hintsEnabled;
            if (this.animationsToggle) this.animationsToggle.checked = this.settings.animationsEnabled;
            if (this.autoStandToggle) this.autoStandToggle.checked = this.settings.autoStandOn21;

            this.sound.setEnabled(this.settings.soundEnabled);

            if (!this.settings.animationsEnabled) {
                document.body.classList.add('no-animations');
            }
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    }

    /**
     * Open modal
     */
    openModal(modalId) {
        try {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
                modal.setAttribute('aria-hidden', 'false');

                // Focus first focusable element
                const focusable = modal.querySelector('button, input, select');
                if (focusable) focusable.focus();

                if (modalId === 'stats-modal') {
                    this.updateStatsDisplay();
                }

                trackEvent('UI', 'Modal', 'Opened', modalId);
            }
        } catch (e) {
            console.error('Error opening modal:', e);
        }
    }

    /**
     * Close modal
     */
    closeModal(modalId) {
        try {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('hidden');
                modal.setAttribute('aria-hidden', 'true');
                trackEvent('UI', 'Modal', 'Closed', modalId);
            }
        } catch (e) {
            console.error('Error closing modal:', e);
        }
    }

    /**
     * Close all modals
     */
    closeAllModals() {
        this.closeModal('stats-modal');
        this.closeModal('settings-modal');
    }

    /**
     * Confirm stats reset
     */
    confirmResetStats() {
        if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
            this.stats.reset();
            this.updateStatsDisplay();
            this.showMessage('Statistics reset successfully', 'info');
        }
    }
}

/**
 * Initialize game when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}

function initializeGame() {
    try {
        window.blackjackGame = new BlackjackGame();
    } catch (e) {
        console.error('Fatal error initializing game:', e);
        trackError(e);

        // Show user-friendly error message
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #fff;">
                    <h2>⚠️ Error Loading Game</h2>
                    <p>Sorry, there was an error loading the game. Please refresh the page to try again.</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; font-size: 1rem;">
                        Refresh Page
                    </button>
                </div>
            `;
        }
    }
}
