const timerElement = document.getElementById("timer");
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const startButton = document.getElementById("startBtn");
const submitButton = document.getElementById("submitBtn");
const resetButton = document.getElementById("resetBtn");
const resultElement = document.getElementById("result");
const spinnerElement = document.getElementById("spinner");
const progressBar = document.getElementById("progressBar");

let counter = 0;
let counterInterval;
let timerStarted = false;

function startCounter() {
    if (timerStarted) return; // Prevent multiple timers
    timerStarted = true;
    counter = 0;
    clearInterval(counterInterval);
    counterInterval = setInterval(() => {
        counter += 1;
        timerElement.textContent = counter;
    }, 1000);
}

function stopCounter() {
    clearInterval(counterInterval);
    timerStarted = false;
}

function updateProgressBar() {
    const typedLength = quoteInputElement.value.length;
    const totalLength = quoteDisplayElement.textContent.length;
    const progress = (typedLength / totalLength) * 100;
    progressBar.style.width = `${progress}%`;
}

function fetchNewQuote() {
    spinnerElement.classList.remove("d-none");
    fetch("https://apis.ccbp.in/random-quote")
        .then(response => response.json())
        .then(data => {
            spinnerElement.classList.add("d-none");
            quoteDisplayElement.textContent = data.content;
            quoteInputElement.disabled = false;
            startButton.disabled = false; // Enable the start button
        })
        .catch(error => {
            spinnerElement.classList.add("d-none");
            quoteDisplayElement.textContent = "Failed to load quote. Please try again.";
            console.error("Error fetching quote:", error);
        });
}

startButton.addEventListener("click", () => {
    if (!timerStarted) {
        startCounter();
        startButton.disabled = true; // Disable the start button
        submitButton.disabled = false; // Enable the submit button
    }
});

quoteInputElement.addEventListener("input", updateProgressBar);

resetButton.addEventListener("click", () => {
    stopCounter();
    fetchNewQuote();
    quoteInputElement.value = "";
    resultElement.textContent = "";
    progressBar.style.width = "0%";
    timerElement.textContent = "0";
    startButton.disabled = false; // Enable the start button for new test
    submitButton.disabled = true; // Disable submit button until the test is started
});

submitButton.addEventListener("click", () => {
    stopCounter();
    if (quoteInputElement.value.trim() === quoteDisplayElement.textContent.trim()) {
        resultElement.textContent = `You typed in ${counter} seconds!`;
    } else {
        resultElement.textContent = "You typed the sentence incorrectly.";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    fetchNewQuote();
});
