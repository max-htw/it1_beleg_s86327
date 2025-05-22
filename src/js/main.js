"use strict";

import { model } from "./model.js";
import { view } from "./view.js";

document.addEventListener("DOMContentLoaded", () => {
  view.bindCategoryButtons(startQuiz);
  view.bindRestartButton(view.resetView);

  async function startQuiz(category) {
    view.setCategory(category);
    await model.load(category);
    view.showQuizView();
    loadNextQuestion();
  }

  function loadNextQuestion() {
    const question = model.getCurrentQuestion();
    if (!question) return;

    view.showQuestion(question, handleAnswer);
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
