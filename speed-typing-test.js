const timerElement = document.getElementById("timer");
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const submitButton = document.getElementById("submitBtn");
const resetButton = document.getElementById("resetBtn");
const resultElement = document.getElementById("result");
const spinnerElement = document.getElementById("spinner");
const progressBar = document.getElementById("progressBar");

let counter = 0;
let counterInterval;

function startCounter() {
    counter = 0;
    clearInterval(counterInterval);
    counterInterval = setInterval(() => {
        counter += 1;
        timerElement.textContent = counter;
    }, 1000);
}

function stopCounter() {
    clearInterval(counterInterval);
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
            startCounter();
        })
        .catch(error => {
            spinnerElement.classList.add("d-none");
            quoteDisplayElement.textContent = "Failed to load quote. Please try again.";
            console.error("Error fetching quote:", error);
        });
}

quoteInputElement.addEventListener("input", updateProgressBar);

resetButton.addEventListener("click", () => {
    stopCounter();
    fetchNewQuote();
    quoteInputElement.value = "";
    resultElement.textContent = "";
    progressBar.style.width = "0%";
    timerElement.textContent = "0";
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
