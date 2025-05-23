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
      const quizIdMin = 2000;
      const quizIdMax = 2010;
      const numberOfQuestions = 5;
      const maxRetries = 10;

      questions = [];

      while (questions.length < numberOfQuestions) {
        let success = false;

        for (let i = 0; i < maxRetries; i++) {
          const randomQuizId = Math.floor(Math.random() * (quizIdMax - quizIdMin + 1)) + quizIdMin;
          console.log(`Frage ${questions.length + 1}: Versuch ${i + 1} – Quiz-ID: ${randomQuizId}`);

          try {
            await loadExternal(randomQuizId);

            // Duplikate vermeiden
            const alreadyLoaded = questions.some(q => q.id === externalQuestion.id);
            if (!alreadyLoaded) {
              questions.push(externalQuestion);
              success = true;
              break;
            } else {
              console.log("Quiz-ID bereits geladen, überspringe.");
            }
          } catch (error) {
            console.warn("Fehler beim Laden von Quiz-ID", randomQuizId, ":", error.message);
          }
        }

        if (!success) {
          alert("Es konnten nicht genügend gültige Fragen geladen werden.");
          break;
        }
      }

    } else {
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