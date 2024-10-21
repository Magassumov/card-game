const gameBoard = document.querySelector('.game-board');
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let timerElement = document.getElementById('timer');
let seconds = 0;
let timerInterval;
let gameStarted = false;
let gameInProgress = false; // Новый флаг для отслеживания состояния игры
let restartBtn = document.getElementById('restart-btn');
let startBtn = document.getElementById('start-btn'); // Кнопка Старт
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

// Показать все карточки с числами на 3 секунды
function showCardsForAWhile() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('flipped');
        card.textContent = card.getAttribute('data-value');
    });

    // Закрываем карточки обратно через 3 секунды
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('flipped');
            card.textContent = '';
        });
        gameInProgress = true; // Игра начинается после того, как карточки закрылись
    }, 5000);
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
    if (!gameInProgress || lockBoard) return; // Игра должна быть запущена и не заблокирована
    if (this === firstCard) return;

    startTimer();

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
    startBtn.style.display = 'block'; // Возвращаем кнопку Старт
    seconds = 0; // Сбрасываем таймер
    timerElement.textContent = '00:00';
    gameStarted = false;
    gameInProgress = false; // Игра ещё не началась
    numbers = numbers.sort(() => 0.5 - Math.random()); // Перемешиваем карточки
    createCards(numbers); // Пересоздаем карточки
}

// Старт игры по нажатию кнопки "Старт"
startBtn.addEventListener('click', () => {
    showCardsForAWhile();
    startBtn.style.display = 'none'; // Скрываем кнопку Старт после начала игры
});

// Перезапуск игры по нажатию кнопки "Повторим?"
restartBtn.addEventListener('click', restartGame);
