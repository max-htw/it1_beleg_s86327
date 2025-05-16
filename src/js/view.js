"use strict";

import { shuffle } from "./utils.js";

export const view = (() => {
  let currentCategory = "";

  const questionText = document.getElementById("question-text");
  const answersContainer = document.getElementById("answers");
  const progressBar = document.getElementById("progress-bar");
  const resultArea = document.getElementById("result-area");
  const questionArea = document.getElementById("question-area");
  const summary = document.getElementById("summary");

  function bindCategoryButtons(handler) {
    const buttons = document.querySelectorAll("#category-selection button");
    buttons.forEach(button =>
      button.addEventListener("click", () => handler(button.dataset.category))
    );
  }

  function setCategory(category) {
    currentCategory = category;
  }

  function bindRestartButton(handler) {
    const buttons = document.querySelectorAll(".restart-btn");
  
    buttons.forEach(button => {
        button.addEventListener("click", handler);
    });
  }

  function showQuizView() {
    document.getElementById("category-selection").classList.add("hidden");
    document.getElementById("question-area").classList.remove("hidden");
    resultArea.classList.add("hidden");
  }

  function showQuestion(question, onAnswer) {
    answersContainer.innerHTML = "";

    // Wenn Kategorie Mathe → mit KaTeX rendern
    if (currentCategory === "mathe") {
      katex.render(question.a, questionText, { throwOnError: false });
    } else {
      questionText.textContent = question.a;
    }    

    const shuffled = shuffle([...question.l]);
    shuffled.forEach(answer => {
      const btn = document.createElement("button");

      if (currentCategory === "mathe") {
        // Antwortelement leeren und rendern
        btn.innerHTML = ""; // leer
        katex.render(answer, btn, { throwOnError: false });
      } else {
        btn.textContent = answer;
      }

      btn.addEventListener("click", () => onAnswer(answer, question.l[0]));
      answersContainer.appendChild(btn);
    });
  }

  function updateProgress(current, total) {
    progressBar.value = (current / total) * 100;
  }

  function showResult(correct, total) {
    questionArea.classList.add("hidden");
    resultArea.classList.remove("hidden");
    summary.textContent = `Du hast ${correct} von ${total} Fragen richtig beantwortet.`;
  }

  function resetView() {
    document.getElementById("category-selection").classList.remove("hidden");
    questionArea.classList.add("hidden");
    resultArea.classList.add("hidden");
    progressBar.value = 0;
  }

  return {
    bindCategoryButtons,
    bindRestartButton,
    showQuestion,
    updateProgress,
    showResult,
    showQuizView,
    resetView,
    setCategory
  };
})();