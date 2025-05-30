"use strict";

import { shuffle } from "./utils.js";

export const model = (() => {
  // Variablen initialisieren
  let questions = [];
  let category = "";
  let currentIndex = 0;
  let correctCount = 0;

  let externalQuestion = null; // temporäre Variable für REST-Daten
  let externalCorrectIndex = null;

  // Lädt Fragen aus JSON oder REST-API
  async function load(categoryName) {
    category = categoryName;
    currentIndex = 0;
    correctCount = 0;

    if (category === "extern") {
      const quizIdMin = 2000; // Auswahlbereich für externe Fragen
      const quizIdMax = 2010; // Auswahlbereich für externe Fragen
      const numberOfQuestions = 5; // Anzahl der zu ladenden Fragen
      const maxRetries = 10; // Anzahl an Wiederholungs-Versuchen, falls eine ID nicht vergeben ist

      // Fehlermeldung beim Aufruf der externen Fragen im Offline-Modus
      if (!navigator.onLine) {
        throw new Error("Externe Fragen können offline nicht geladen werden.");
      }

      questions = [];

      // Versuche mehrfach, gültige (nicht doppelte) Quizfragen zu laden
      while (questions.length < numberOfQuestions) {
        let success = false;

        for (let i = 0; i < maxRetries; i++) {
          const randomQuizId = Math.floor(Math.random() * (quizIdMax - quizIdMin + 1)) + quizIdMin;

          try {
            await loadExternal(randomQuizId);

            const alreadyLoaded = questions.some(q => q.id === externalQuestion.id); // prüft, ob mindestens ein Eintrag in questions schon die gleiche ID hat wie externalQuestion
            if (!alreadyLoaded) {
              questions.push(externalQuestion);
              success = true;
              break;
            }
          } catch (error) {
            // Fehlerausgabe bei nicht vorhandener ID
            console.warn("Fehler beim Laden von Quiz-ID", randomQuizId, ":", error.message);
          }
        }

        if (!success) {
          alert("Es konnten nicht genügend gültige Fragen geladen werden.");
          break;
        }
      }

    // Handling für interne Fragen
    } else {
      const res = await fetch("data/questions.json");
      const data = await res.json();
      questions = shuffle(data[category] || []);
    }
  }

  // Holt eine einzelne Quizfrage vom REST-Server
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

  // Schickt Antwort zu REST-Server (bei externen Fragen)
  async function submitExternalAnswer(index) {
    const question = questions[currentIndex];
    const url = `https://idefix.informatik.htw-dresden.de:8888/api/quizzes/${question.id}/solve`;
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
      throw new Error("Antwort konnte nicht kontrolliert werden");
    }

    const result = await res.json();
    return result.success;
  }

  // Korrekte Antworten zu Statistik hinzufügen
  function markAnswer(correct) {
    if (correct) correctCount++;
    currentIndex++;
  }

  function isFinished() {
    return currentIndex >= questions.length;
  }

  function getCategory() {
    return category;
  }

  function getCurrentQuestion() {
    return questions[currentIndex];
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
    isFinished,
    getProgress,
    submitExternalAnswer,
    getCategory,
    markAnswer,
  };
})();