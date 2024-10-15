const gameBoard = document.querySelector('.game-board');
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let timerElement = document.getElementById('timer');
let seconds = 0;
let timerInterval;
let gameStarted = false;
let restartBtn = document.getElementById('restart-btn');
let winMessage = document.getElementById('win-message');

// Генерируем массив из 10 пар чисел
let numbers = [];
for (let i = 0; i < 10; i++) {
    numbers.push(i, i);
}
numbers = numbers.sort(() => 0.5 - Math.random());
createCards(numbers); // Создаем карточки

function createCards(numbers) {
    gameBoard.innerHTML = ''; // Очищаем игровое поле
    numbers.forEach(number => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-value', number);
        gameBoard.appendChild(card);
        card.addEventListener('click', flipCard);
    });
}

// Функция для старта таймера
function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(() => {
            seconds++;
            timerElement.textContent = formatTime(seconds);
        }, 1000);
    }
}

// Функция для форматирования времени
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Остановка таймера
function stopTimer() {
    clearInterval(timerInterval);
}

// Логика переворота карточек
function flipCard() {
    startTimer();
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    this.textContent = this.getAttribute('data-value');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    setTimeout(checkForMatch, 500);
}

// Проверяем совпадение карточек
function checkForMatch() {
    const isMatch = firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value');
    isMatch ? disableCards() : unflipCards();
}

// Убираем совпавшие карточки
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    checkForWin();
    resetBoard();
}

// Закрываем не совпавшие карточки
function unflipCards() {
    setTimeout(() => {
        firstCard.style.backgroundColor = '#FFD700'; // Цвет желтый
        secondCard.style.backgroundColor = '#FFD700'; // Цвет желтый
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 500);
}

// Проверяем победу
function checkForWin() {
    let allCardsMatched = document.querySelectorAll('.card:not(.matched)').length === 0;
    if (allCardsMatched) {
        stopTimer();
        showWinMessage();
    }
}

// Показываем сообщение о победе
function showWinMessage() {
    gameBoard.classList.add('hidden'); // Скрываем игровое поле
    winMessage.style.display = 'flex'; // Показываем сообщение о победе
}

// Сброс доски после переворота
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Функция для перезапуска игры
function restartGame() {
    winMessage.style.display = 'none'; // Скрываем сообщение о победе
    gameBoard.classList.remove('hidden'); // Показываем игровое поле
    seconds = 0; // Сбрасываем таймер
    timerElement.textContent = '00:00';
    gameStarted = false;
    numbers = numbers.sort(() => 0.5 - Math.random()); // Перемешиваем карточки
    createCards(numbers); // Пересоздаем карточки
}

restartBtn.addEventListener('click', restartGame);
