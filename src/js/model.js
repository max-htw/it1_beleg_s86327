"use strict";

import { shuffle } from "./utils.js";

export const model = (() => {
  let questions = [];
  let category = "";
  let currentIndex = 0;
  let correctCount = 0;

  let externalQuestion = null; // für externes REST-Quiz
  let externalCorrectIndex = null;

  async function load(categoryName) {
    category = categoryName;
    currentIndex = 0;
    correctCount = 0;

    if (category === "extern") {
      await loadExternal(2009); // Hier die Quiz-ID angeben
      questions = [externalQuestion];
    }
    else {
      const res = await fetch("data/questions.json");
      const data = await res.json();
      questions = shuffle(data[category] || []);
    }
  }

  function getCategory() {
    return category;
  }

  function markAnswer(correct) {
    if (correct) correctCount++;
    currentIndex++;
  }

  async function loadExternal(quizId) {
    const url = `https://idefix.informatik.htw-dresden.de:8888/api/quizzes/${quizId}`;
    const username = "maximilian.lohr@stud.htw-dresden.de";
    const password = "xorsax-sukdi0-rIjdyf";
    const credentials = btoa(`${username}:${password}`);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`
      }
    });

    if (!response.ok) {
      throw new Error("HTTP-Fehler: " + response.status);
    }

    const data = await response.json();

    externalQuestion = {
      id: data.id,
      a: data.text,
      l: data.options
    };
  }

  async function submitExternalAnswer(index) {
    const url = `https://idefix.informatik.htw-dresden.de:8888/api/quizzes/${externalQuestion.id}/solve`;
    const username = "maximilian.lohr@stud.htw-dresden.de";
    const password = "xorsax-sukdi0-rIjdyf";
    const credentials = btoa(`${username}:${password}`);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`
      },
      body: JSON.stringify([index])
    });

    if (!res.ok) {
      throw new Error("Antwort konnte nicht bewertet werden");
    }

    const result = await res.json();
    return result.success;
  }


  function getCurrentQuestion() {
    return category === "extern"
      ? externalQuestion
      : questions[currentIndex];
  }


  function checkAnswer(selected, correct) {
    if (category === "extern") {
      const correctAnswer = externalQuestion.l[externalCorrectIndex];
      if (selected === correctAnswer) correctCount++;
        currentIndex++;
    } 
    else {
      if (selected === correct) correctCount++;
      currentIndex++;
    }
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
    getProgress,
    submitExternalAnswer,
    getCategory,
    markAnswer,
  };
})();