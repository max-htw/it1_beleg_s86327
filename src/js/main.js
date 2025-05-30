// Registriert Service Worker für Offline-Funktionalität
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
    .then(() => console.log("✅ Service Worker registriert"))
    .catch((err) => console.error("❌ Service Worker Fehler:", err));
}

"use strict";

import { model } from "./model.js";
import { view } from "./view.js";

// Abwarten bis HTML vollständig geladen, bevor weiterer Code ausgeführt wird
document.addEventListener("DOMContentLoaded", () => {
  view.bindCategoryButtons(startQuiz);
  view.bindRestartButton(view.resetView);

  // Startet Quiz (nach Kategorienauswahl)
  async function startQuiz(category) {
    try {
      view.setCategory(category);
      view.showLoading(); // zeigt Ladeanimation
      await model.load(category); // lädt Fragen (intern oder extern)
      view.hideLoading(); 
      view.showQuizView(); // zeigt Fragenbereich
      loadNextQuestion();
    } catch (err) {
      view.hideLoading();
      alert(`Fehler beim Laden der Kategorie: ${err.message}`);
      view.resetView(); // zurück zur Kategorieauswahl
    }
  }

  // Lädt und zeigt die nächste Frage
  function loadNextQuestion() {
    const question = model.getCurrentQuestion();
    if (!question) return;

    view.showQuestion(question, handleAnswer);
    
    // Für Noten: Audio-Button verbinden
    if (model.getCategory() === "noten") {
      view.bindAudioButton(() => model.getCurrentQuestion());
    }

    // Progress-Bar updaten
    const progress = model.getProgress();
    view.updateProgress(progress.current, progress.total);
  }

  // Antwortverarbeitung: intern oder extern
  async function handleAnswer(selected, correctOrNull) {
    let isCorrect = false;

    if (model.getCategory() === "extern") {
      const selectedIndex = model.getCurrentQuestion().l.indexOf(selected); // Sucht den Index der  Antwort in der Antwortmöglichkeiten-Liste
      isCorrect = await model.submitExternalAnswer(selectedIndex);
    } else {
      isCorrect = selected === correctOrNull;
    }

    model.markAnswer(isCorrect);

    // Nach letzter Frage Statistik anzeigen oder nächste Frage ladeb
    if (model.isFinished()) {
      const stats = model.getProgress();
      view.showResult(stats.correct, stats.total);
    } else {
      loadNextQuestion();
    }
  }
});