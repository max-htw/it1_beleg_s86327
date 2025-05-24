"use strict";

import { shuffle } from "./utils.js";
const VF = Vex.Flow;


export const view = (() => {
  let currentCategory = "";

  const questionText = document.getElementById("question-text");
  const answersContainer = document.getElementById("answers");
  const progressBar = document.getElementById("progress-bar");
  const resultArea = document.getElementById("result-area");
  const questionArea = document.getElementById("question-area");
  const summary = document.getElementById("summary");
  const loadingArea = document.getElementById("loading-area");

  function showLoading() {
  loadingArea.classList.remove("hidden");
  questionArea.classList.add("hidden");
  resultArea.classList.add("hidden");
}

  function hideLoading() {
    loadingArea.classList.add("hidden");
  }

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
    questionText.textContent = "";
    document.getElementById("note-canvas").innerHTML = ""; // Canvas zurücksetzen

    // Wenn Kategorie Mathe → mit Vexflow rendern
    if (currentCategory === "noten") {
      renderNote(question.a);
    }
    // Wenn Kategorie Mathe → mit KaTeX rendern
    else if (currentCategory === "mathe") {
      katex.render(question.a, questionText, { throwOnError: false });
    } 
    else {
      questionText.textContent = question.a;
    }    

    const shuffled = shuffle([...question.l]);
    shuffled.forEach(answer => {
      const btn = document.createElement("button");
      btn.textContent = answer;
      btn.addEventListener("click", () => onAnswer(answer, question.l[0]));
      answersContainer.appendChild(btn);
    });
  }

  function renderNote(noteString) {
    const vf = new VF.Factory({
      renderer: { elementId: "note-canvas", width: 300, height: 120 }
    });

    const score = vf.EasyScore();
    const system = vf.System();
    
    try {
      const notes = score.notes(noteString, { stem: 'up' });
      const voice = score.voice(notes);
      // Strikten Modus deaktivieren, damit auch "Standardnoten" gezeichnet werden
      voice.setStrict(false);

      system.addStave({ voices: [voice] });
      vf.draw();
    }
    catch (err) {
      console.error("VexFlow Render Error:", err);
      document.getElementById("note-canvas").textContent = "Noten konnten nicht dargestellt werden.";
    }
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
    setCategory,
    showLoading,
    hideLoading
  };
})();