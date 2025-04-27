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
let quote = "";

function startCounter() {
  if (timerStarted) return;
  timerStarted = true;
  counter = 0;
  timerElement.textContent = counter;
  clearInterval(counterInterval);
  counterInterval = setInterval(() => {
    counter++;
    timerElement.textContent = counter;
  }, 1000);
}

function stopCounter() {
  clearInterval(counterInterval);
  timerStarted = false;
}

function updateProgressBar() {
  const typedLength = quoteInputElement.value.length;
  const totalLength = quote.length;
  const progress = (typedLength / totalLength) * 100;
  progressBar.style.width = `${progress}%`;
}

function fetchNewQuote() {
  spinnerElement.classList.remove("d-none");
  fetch("https://apis.ccbp.in/random-quote")
    .then(response => response.json())
    .then(data => {
      spinnerElement.classList.add("d-none");
      quote = data.content;
      quoteDisplayElement.textContent = quote;
      quoteInputElement.disabled = false;
      startButton.disabled = false;
      quoteInputElement.value = "";
      resultElement.textContent = "";
      progressBar.style.width = "0%";
      timerElement.textContent = "0";
    })
    .catch(error => {
      spinnerElement.classList.add("d-none");
      quoteDisplayElement.textContent = "Failed to load quote. Please try again.";
      console.error("Error fetching quote:", error);
    });
}

startButton.addEventListener("click", () => {
  startCounter();
  startButton.disabled = true;
  submitButton.disabled = false;
  quoteInputElement.focus();
});

quoteInputElement.addEventListener("input", updateProgressBar);

submitButton.addEventListener("click", () => {
    stopCounter();
    const typedText = quoteInputElement.value;
  
    if (typedText === quote) {
      resultElement.textContent = `🎉 Congratulations! You typed correctly in ${counter} seconds.`;
      resultElement.style.color = "green";
    } else {
      resultElement.textContent = "❌ Typing Incorrect. Please try again.";
      resultElement.style.color = "red";
      highlightMistakes();
    }
    submitButton.disabled = true;
  });
  

resetButton.addEventListener("click", () => {
  stopCounter();
  fetchNewQuote();
});

function highlightMistakes() {
    const typedText = quoteInputElement.value;
    let html = "";
  
    for (let i = 0; i < quote.length; i++) {
      const char = quote[i];
      if (typedText[i] == null) {
        html += `<span>${char}</span>`;
      } else if (typedText[i] === char) {
        html += `<span class="correct-char">${char}</span>`;
      } else {
        html += `<span class="wrong-char">${char}</span>`;
      }
    }
  
    quoteDisplayElement.innerHTML = html;
  }
  

document.addEventListener("DOMContentLoaded", fetchNewQuote);
