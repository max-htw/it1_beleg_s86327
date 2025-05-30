"use strict";

import { shuffle } from "./utils.js";
const VF = Vex.Flow;

export const view = (() => {
  let currentCategory = "";

  // DOM-Elemente
  const answersContainer = document.getElementById("answers");
  const progressBar = document.getElementById("progress-bar");
  const resultArea = document.getElementById("result-area");
  const questionArea = document.getElementById("question-area");
  const summary = document.getElementById("summary");
  const loadingArea = document.getElementById("loading-area");
  const noteCanvas = document.getElementById("note-canvas");
  const audioButtonArea = document.getElementById("audio-button-area");
  const questionText = document.getElementById("question-text");

  // Ladebildschirm anzeigen
  function showLoading() {
    loadingArea.classList.remove("hidden");
    questionArea.classList.add("hidden");
    resultArea.classList.add("hidden");
  }

  // Ladebildschirm ausblenden
  function hideLoading() {
    loadingArea.classList.add("hidden");
  }

  // Kategorie-Buttons binden und Clicks erkennen
  function bindCategoryButtons(handler) {
    const buttons = document.querySelectorAll("#category-selection button");
    buttons.forEach(button =>
      button.addEventListener("click", () => handler(button.dataset.category))
    );
  }

  // Aktuelle Kategorie speichern
  function setCategory(category) {
    currentCategory = category;
  }

 // Restart-Buttons binden und Clicks erkennen
  function bindRestartButton(handler) {
    const buttons = document.querySelectorAll(".restart-btn");
    buttons.forEach(button => button.addEventListener("click", handler));
  }

  // Quizansicht einblenden
  function showQuizView() {
    document.getElementById("category-selection").classList.add("hidden");
    questionArea.classList.remove("hidden");
    resultArea.classList.add("hidden");
  }

  // Frage und mögliche Antworten anzeigen
  function showQuestion(question, onAnswer) {
    answersContainer.innerHTML = "";
    questionText.textContent = "";
    noteCanvas.innerHTML = "";
    audioButtonArea.classList.add("hidden");

    if (currentCategory === "noten") {
      // Noten rendern
      renderNote(question.a);
      // Audiobutton anzeigen
      audioButtonArea.classList.remove("hidden");
    } else if (currentCategory === "mathe") {
      // Mathefrage mit KaTeX rendern
      katex.render(question.a, questionText, { throwOnError: false });
    } else {
      // Normale Frage als Text
      questionText.textContent = question.a;
    }

    // Antwortmöglichkeiten anzeigen
    const shuffled = shuffle([...question.l]);
    shuffled.forEach(answer => {
      const btn = document.createElement("button");
      btn.textContent = answer;
      btn.addEventListener("click", () => onAnswer(answer, question.l[0]));
      answersContainer.appendChild(btn);
    });
  }

  // Noten-Rendering mit VexFlow
  function renderNote(noteString) {
    const vf = new VF.Factory({
      renderer: { elementId: "note-canvas", width: 120, height: 120 }
    });

    const score = vf.EasyScore();
    const system = vf.System();

    try {
      const notes = score.notes(noteString, { stem: "up" });
      const voice = score.voice(notes);
      voice.setStrict(false); // für einfachere Notation

      system.addStave({ voices: [voice] });
      vf.draw();
    } catch (err) {
      console.error("VexFlow Render Error:", err);
      noteCanvas.textContent = "Noten konnten nicht dargestellt werden.";
    }
  }

  // Button zur Audiowiedergabe verknüpfen
  function bindAudioButton(getQuestion) {
    const audioBtn = document.getElementById("audio-btn");
    if (!audioBtn) return;

    audioBtn.onclick = () => {
      const question = getQuestion();
      if (!question || !question.a) return;

      // Noten aus String extrahieren, z.B. "(C4 E4 G4)" → ["C4", "E4", "G4"]
      const notes = question.a.replace(/[()]/g, "").split(/\s+/);

      // Tone.js Audioausgabe
      const synth = new Tone.PolySynth().toDestination();
      synth.triggerAttackRelease(notes, "8n");
    };
  }

  // Fortschrittsanzeige aktualisieren
  function updateProgress(current, total) {
    progressBar.value = (current / total) * 100;
  }

  // Ergebnis anzeigen
  function showResult(correct, total) {
    questionArea.classList.add("hidden");
    resultArea.classList.remove("hidden");
    audioButtonArea.classList.add("hidden");

    summary.textContent = `Du hast ${correct} von ${total} Fragen richtig beantwortet.`;
  }

  // Zurücksetzen der App auf Startansicht
  function resetView() {
    document.getElementById("category-selection").classList.remove("hidden");
    questionArea.classList.add("hidden");
    resultArea.classList.add("hidden");
    audioButtonArea.classList.add("hidden");
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
    hideLoading,
    bindAudioButton
  };
})();