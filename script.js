const game = document.getElementById('game');
const spaceship = document.getElementById('spaceship');
const lifeBar = document.getElementById('life');
const wordInput = document.getElementById('wordInput');
const correctWordsEl = document.getElementById('correctWords');
const incorrectWordsEl = document.getElementById('incorrectWords');
const levelEl = document.getElementById('level');

const words = [
    "top", "bottom", "left", "right", "color", 
    "border", "padding", "margin", "display", 
    "flex", "content", "justify", "align", 
    "background", "font", "width", "height", 
    "position", "float", "clear", "z-index", 
    "opacity", "overflow", "grid", "visibility", 
    "cursor", "media", "responsive", "gap", 
    "clip", "animation", "keyframes", "transform", 
    "transition"
];

const doubleWords = [
    "text-align", "box-shadow", "border-radius", 
    "flex-direction", "flex-wrap", "align-items", 
    "align-self", "justify-content", "min-width", 
    "max-width", "min-height", "max-height", 
    "background-color", "font-size", "font-weight", 
    "line-height", "text-decoration", "text-transform", 
    "letter-spacing", "word-spacing", "border-collapse", 
    "border-spacing", "table-layout", "caption-side", 
    "empty-cells", "list-style", "list-style-type", 
    "list-style-position", "box-sizing", "flex-grow", 
    "flex-shrink", "flex-basis", "flex-flow", 
    "flex-align", "flex-order", "position-relative", 
    "position-absolute", "position-fixed", 
    "position-sticky", "overflow-x", "overflow-y", 
    "visibility-hidden", "visibility-visible", 
    "color-red", "color-blue", "color-green", 
    "color-black", "color-white", "border-solid", 
    "border-dashed", "border-dotted", "outline", 
    "outline-offset", "outline-color", "outline-style", 
    "outline-width", "text-shadow"
];

let life = 100;
let correctWords = 0;
let incorrectWords = 0;
let level = 1;
let gamePaused = false;
let asteroidSpeed = 16;
let asteroids = [];
const maxVisibleWords = 5;

function createAsteroid() {
    if (asteroids.length >= maxVisibleWords) return;

    const asteroid = document.createElement('div');
    asteroid.classList.add('asteroid');
    const isDoubleWord = Math.random() < 0.2; 
    asteroid.textContent = isDoubleWord ? 
        doubleWords[Math.floor(Math.random() * doubleWords.length)] : 
        words[Math.floor(Math.random() * words.length)];
    
    asteroid.style.left = `${Math.floor(Math.random() * (game.clientWidth - 50))}px`;
    asteroid.style.top = '0px';
    

    asteroid.addEventListener('click', () => {
        asteroid.remove();
        asteroids.splice(asteroids.indexOf(asteroid), 1);
        correctWords++;
        updateStats();
    });

    game.appendChild(asteroid);
    asteroids.push(asteroid);
}

function updateAsteroids() {
    if (gamePaused) return;

    asteroids.forEach((asteroid, index) => {
        const currentTop = parseInt(window.getComputedStyle(asteroid).top);
        asteroid.style.top = `${currentTop + asteroidSpeed}px`;

        if (currentTop >= spaceship.offsetTop) {
            life -= 20;
            updateLife();
            asteroid.remove();
            asteroids.splice(index, 1);
            incorrectWords++;
            updateStats();
        }
    });

    if (asteroids.length < maxVisibleWords) {
        createAsteroid();
    }
}

function clearAsteroids() {
    asteroids.forEach(asteroid => asteroid.remove());
    asteroids = [];
}

function updateLife() {
    lifeBar.style.width = `${life}%`;
    if (life > 75) {
        lifeBar.style.backgroundColor = 'green';
        lifeBar.style.boxShadow = 'none';
    } else if (life > 50) {
        lifeBar.style.backgroundColor = 'yellow';
        lifeBar.style.boxShadow = 'none';
    } else if (life > 25) {
        lifeBar.style.backgroundColor = 'orange';
        lifeBar.style.boxShadow = '0 0 10px red';
        lifeBar.classList.remove('pulsing');
    } else {
        lifeBar.style.backgroundColor = 'red';
        lifeBar.classList.add('pulsing');
    }

    if (life <= 0) {
        alert("Game Over!");
        location.reload();
    }
}

function updateStats() {
    correctWordsEl.textContent = correctWords;
    incorrectWordsEl.textContent = incorrectWords;
    levelEl.textContent = level;

    if (correctWords > 0 && correctWords % 50 === 0) {
        level++;
        asteroidSpeed += 8;
        clearAsteroids();
        alert(`¡Felicidades, has alcanzado el nivel: ${level}!`);
    }
}

function checkWord(event) {
    if (event.key === 'Enter') {
        const inputWord = wordInput.value.trim();
        wordInput.value = '';
        let matched = false;

        asteroids.forEach((asteroid, index) => {
            if (asteroid.textContent === inputWord) {
                asteroid.remove();
                asteroids.splice(index, 1);
                correctWords++;
                
                if (doubleWords.includes(inputWord)) {
                    const lifeIncrease = Math.min(inputWord.length, 100 - life);
                    life += lifeIncrease; 
                    updateLife();
                }
                
                matched = true;
                updateStats();
            }
        });

        if (!matched) {
            const damage = inputWord.length;
            life -= damage;
            incorrectWords++;
            updateStats();
            updateLife();
        }
    } else if (event.key === 'Escape') {
        gamePaused = !gamePaused;
    }
}

setInterval(updateAsteroids, 1000);
wordInput.addEventListener('keydown', checkWord);
