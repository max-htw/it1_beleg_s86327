"use strict";

import { shuffle } from "./utils.js";

export const model = (() => {
  let questions = [];
  let category = "";
  let currentIndex = 0;
  let correctCount = 0;

  async function load(categoryName) {
    const res = await fetch("data/questions.json");
    const data = await res.json();
    category = categoryName;
    questions = shuffle(data[category] || []);
    currentIndex = 0;
    correctCount = 0;
  }

  function getCurrentQuestion() {
    return questions[currentIndex];
  }

  function checkAnswer(selected, correct) {
    if (selected === correct) {
      correctCount++;
    }
    currentIndex++;
  }

  function isFinished() {
    return currentIndex >= questions.length;
  }

  function getProgress() {
    return {
      current: currentIndex,
      total: questions.length,
      correct: correctCount
    };
  }

  return {
    load,
    getCurrentQuestion,
    checkAnswer,
    isFinished,
    getProgress
  };
})();