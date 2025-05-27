// Service Worker Registrierung
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
    .then(() => console.log("✅ Service Worker registriert"))
    .catch((err) => console.error("❌ Service Worker Fehler:", err));
}

"use strict";

import { model } from "./model.js";
import { view } from "./view.js";

document.addEventListener("DOMContentLoaded", () => {
  view.bindCategoryButtons(startQuiz);
  view.bindRestartButton(view.resetView);

  async function startQuiz(category) {
    try {
      view.setCategory(category);
      view.showLoading(); // Ladeanzeige anzeigen
      await model.load(category);
      view.hideLoading(); // Ladeanzeige ausblenden
      view.showQuizView();
      loadNextQuestion();
    }
    catch (err) {
      view.hideLoading();
      alert(`Fehler beim Laden der Kategorie: ${err.message}`);
      view.resetView();
    }
  }

  function loadNextQuestion() {
    const question = model.getCurrentQuestion();
    if (!question) return;

    view.showQuestion(question, handleAnswer);
    if (model.getCategory() === "noten") {
      view.bindAudioButton(() => model.getCurrentQuestion());
    }
    const progress = model.getProgress();
    view.updateProgress(progress.current, progress.total);
  }

  async function handleAnswer(selected, correctOrNull) {
    let isCorrect = false;

    if (model.getCategory() === "extern") {
      const selectedIndex = model.getCurrentQuestion().l.indexOf(selected);
      isCorrect = await model.submitExternalAnswer(selectedIndex);
    } else {
      isCorrect = selected === correctOrNull;
    }

    model.markAnswer(isCorrect);

    if (model.isFinished()) {
      const stats = model.getProgress();
      view.showResult(stats.correct, stats.total);
    } else {
      loadNextQuestion();
    }
  }
});
