// Referencias a elementos del DOM
const homePage = document.getElementById("home");
const configPage = document.getElementById("config");
const gamePage = document.getElementById("game");
const resultsPage = document.getElementById("results");

const startGameBtn = document.getElementById("startGameBtn");
const startTriviaBtn = document.getElementById("startTriviaBtn");
const restartBtn = document.getElementById("restartBtn");
const changeConfigBtn = document.getElementById("changeConfigBtn");
const exitBtn = document.getElementById("exitBtn");

const playerNameInput = document.getElementById("playerName");
const numQuestionsInput = document.getElementById("numQuestions");
const difficultySelect = document.getElementById("difficulty");
const categorySelect = document.getElementById("category");

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const questionNumber = document.getElementById("questionNumber");
const timerText = document.getElementById("timer");

const finalScoreText = document.getElementById("finalScore");
const correctAnswersText = document.getElementById("correctAnswers");
const accuracyText = document.getElementById("accuracy");
const averageTimeText = document.getElementById("averageTime");

// Variables del juego
let questions = [];
let currentIndex = 0;
let score = 0;
let correctCount = 0;
let timerInterval;
let timeLeft = 20;
let totalTime = 0;

// ------------------------
// NAVEGACIÓN ENTRE PANTALLAS
// ------------------------

startGameBtn.addEventListener("click", () => {
    homePage.classList.add("hidden");
    configPage.classList.remove("hidden");
});

// ------------------------
// INICIO DEL JUEGO
// ------------------------
startTriviaBtn.addEventListener("click", async () => {
    const name = playerNameInput.value.trim();
    const quantity = parseInt(numQuestionsInput.value);
    
    if (!name || name.length < 2 || name.length > 20) {
        alert("El nombre debe tener entre 2 y 20 caracteres.");
        return;
    }
    if (quantity < 5 || quantity > 20) {
        alert("La cantidad de preguntas debe ser entre 5 y 20.");
        return;
    }

    await loadQuestions();
});

// ------------------------
// PETICIÓN ASÍNCRONA A LA API
// ------------------------
async function loadQuestions() {
    configPage.classList.add("hidden");
    gamePage.classList.remove("hidden");

    optionsContainer.innerHTML = "<h3>Cargando preguntas...</h3>";

    const amount = numQuestionsInput.value;
    const difficulty = difficultySelect.value;
    const category = categorySelect.value;

    let url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;
    if (category !== "any") url += `&category=${category}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al conectar con la API");

        const data = await response.json();
        if (data.results.length === 0) throw new Error("No se pudieron obtener preguntas");

        questions = data.results;
        startGame();

    } catch (error) {
        optionsContainer.innerHTML = `<h3>Error: ${error.message}</h3>`;
    }
}

// ------------------------
// SISTEMA DEL JUEGO
// ------------------------
function startGame() {
    currentIndex = 0;
    score = 0;
    correctCount = 0;
    totalTime = 0;

    loadQuestion();
}

function loadQuestion() {
    clearInterval(timerInterval);
    timeLeft = 20;

    const q = questions[currentIndex];

    questionText.innerHTML = decodeHtml(q.question);
    questionNumber.textContent = `Pregunta ${currentIndex + 1} de ${questions.length}`;

    const options = [...q.incorrect_answers, q.correct_answer];
    shuffleArray(options);

    optionsContainer.innerHTML = "";

    options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = decodeHtml(option);
        btn.onclick = () => selectAnswer(option, q.correct_answer);
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

// ------------------------
// TEMPORIZADOR ASÍNCRONO
// ------------------------
function startTimer() {
    timerText.textContent = `Tiempo: ${timeLeft}`;

    timerInterval = setInterval(() => {
        timeLeft--;
        totalTime++;

        timerText.textContent = `Tiempo: ${timeLeft}`;

        if (timeLeft <= 5) {
            timerText.style.color = "red";
        } else {
            timerText.style.color = "#333";
        }

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            nextQuestion(false); // Tiempo agotado = incorrecto
        }
    }, 1000);
}

// ------------------------
// SELECCIÓN DE RESPUESTAS
// ------------------------
function selectAnswer(selected, correct) {
    clearInterval(timerInterval);

    const buttons = optionsContainer.querySelectorAll("button");

    buttons.forEach(btn => {
        btn.disabled = true;

        if (btn.textContent === decodeHtml(correct)) {
            btn.style.backgroundColor = "#8df58d"; // verde
        } else if (btn.textContent === decodeHtml(selected)) {
            btn.style.backgroundColor = "#f57b7b"; // rojo
        }
    });

    if (selected === correct) {
        score += 10;
        correctCount++;
    }

    setTimeout(() => nextQuestion(true), 1200);
}

// ------------------------
// SIGUIENTE PREGUNTA O RESULTADOS
// ------------------------
function nextQuestion(answered) {
    currentIndex++;

    if (currentIndex >= questions.length) {
        showResults();
    } else {
        loadQuestion();
    }
}

// ------------------------
// PANTALLA DE RESULTADOS
// ------------------------
function showResults() {
    gamePage.classList.add("hidden");
    resultsPage.classList.remove("hidden");

    const name = playerNameInput.value;

    finalScoreText.textContent = `Puntuación total: ${score}`;
    correctAnswersText.textContent = `Respuestas correctas: ${correctCount} / ${questions.length}`;
    accuracyText.textContent = `Porcentaje de aciertos: ${(correctCount / questions.length * 100).toFixed(2)}%`;
    averageTimeText.textContent = `Tiempo promedio: ${(totalTime / questions.length).toFixed(1)} segundos`;
}

// ------------------------
// BOTONES FINALES
// ------------------------
restartBtn.addEventListener("click", () => {
    resultsPage.classList.add("hidden");
    gamePage.classList.remove("hidden");
    startGame();
});

changeConfigBtn.addEventListener("click", () => {
    resultsPage.classList.add("hidden");
    configPage.classList.remove("hidden");
});

exitBtn.addEventListener("click", () => {
    window.location.reload();
});

// ------------------------
// FUNCIONES ÚTILES
// ------------------------
function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
