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

  async function loadExternal(quizId) {
    const url = `https://idefix.informatik.htw-dresden.de:8888/api/quizzes/${quizId}`;
    const username = "maximilian.lohr@stud.htw-dresden.de";
    const password = "xorsax-sukdi0-rIjdyf";
    const credentials = btoa(`${username}:${password}`);

    fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error("Fehler beim Laden des Quiz");
      return response.json();
    });
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