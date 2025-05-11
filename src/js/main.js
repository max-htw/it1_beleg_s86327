"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const categoryButtons = document.querySelectorAll("#category-selection button");
  const questionArea = document.getElementById("question-area");
  const questionText = document.getElementById("question-text");
  const answersContainer = document.getElementById("answers");
  const progressBar = document.getElementById("progress-bar");

  let currentQuestionIndex = 0;
  let correctAnswers = 0;
  let currentCategory = "";
  let questionList = [];

  // Kategorieauswahl
  categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.category;
      fetch(`data/questions.json`)
        .then(res => res.json())
        .then(data => {
          questionList = data[currentCategory];
          currentQuestionIndex = 0;
          correctAnswers = 0;
          showQuestion();
        });
      questionArea.classList.remove("hidden");
      document.getElementById("category-selection").classList.add("hidden");
    });
  });

  // Zeigt eine Frage + Antworten
  function showQuestion() {
    const current = questionList[currentQuestionIndex];
    questionText.textContent = current.a;
    answersContainer.innerHTML = "";

    // Antworten mischen
    const shuffled = shuffleArray([...current.l]);
    shuffled.forEach(answer => {
      const btn = document.createElement("button");
      btn.textContent = answer;
      btn.addEventListener("click", () => checkAnswer(answer, current.l[0]));
      answersContainer.appendChild(btn);
    });

    // Fortschritt aktualisieren
    progressBar.value = ((currentQuestionIndex) / questionList.length) * 100;
  }

  function checkAnswer(selected, correct) {
    if (selected === correct) correctAnswers++;
    currentQuestionIndex++;
    if (currentQuestionIndex < questionList.length) {
      showQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    questionArea.classList.add("hidden");
    const result = document.getElementById("result-area");
    result.classList.remove("hidden");
    document.getElementById("summary").textContent =
      `Du hast ${correctAnswers} von ${questionList.length} Fragen richtig beantwortet.`;
  }

  document.getElementById("restart-btn").addEventListener("click", () => {
    document.getElementById("category-selection").classList.remove("hidden");
    document.getElementById("result-area").classList.add("hidden");
    progressBar.value = 0;
  });

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
});
