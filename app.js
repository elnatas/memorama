const emojis = ['🍎', '🍌', '🍇', '🍉', '🌟', '🔥', '🎈', '💡'];
let cards = [...emojis, ...emojis];
let flipped = [];
let matched = [];
let moves = 0;

const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const pairsEl = document.getElementById('pairs');
const restartBtn = document.getElementById('restart');

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function initGame() {
    flipped = [];
    matched = [];
    moves = 0;
    movesEl.textContent = moves;
    pairsEl.textContent = '0';
    board.innerHTML = '';
    cards = shuffle(cards);
    
    cards.forEach((emoji, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = i;
        card.dataset.emoji = emoji;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard() {
    const idx = parseInt(this.dataset.index);
    if (flipped.length >= 2 || flipped.includes(idx) || matched.includes(idx)) return;
    
    this.classList.add('flipped');
    this.textContent = this.dataset.emoji;
    flipped.push(idx);
    
    if (flipped.length === 2) {
        moves++;
        movesEl.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [i1, i2] = flipped;
    const c1 = document.querySelector(`[data-index="${i1}"]`);
    const c2 = document.querySelector(`[data-index="${i2}"]`);
    
    if (c1.dataset.emoji === c2.dataset.emoji) {
        matched.push(i1, i2);
        c1.classList.add('matched');
        c2.classList.add('matched');
        pairsEl.textContent = matched.length / 2;
        flipped = [];
        
        if (matched.length === cards.length) {
            setTimeout(() => alert(`🎉 ¡Felicidades! Lo lograste en ${moves} movimientos`), 300);
        }
    } else {
        setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            c1.textContent = '';
            c2.textContent = '';
            flipped = [];
        }, 800);
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('✅ Service Worker registrado', reg))
            .catch(err => console.log('❌ Error SW', err));
    });
}

restartBtn.addEventListener('click', initGame);
initGame();
