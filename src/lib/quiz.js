/**
 * @typedef {object} Question
 * @property {string} category Flokkur spurningar
 * @property {string} question Spurningin sjálf
 * @property {string} answer Rétt svar
 */

/**
 * @typedef {object} Result
 * @property {string} category Flokkur spurningar
 * @property {string} question Spurningin sjálf
 * @property {string} answer Svar notanda
 * @property {string} correctAnswer Rétt svar
 * @property {boolean} correct `true` ef notandi svaraði rétt
 */

/**
 * @typedef {object} Stats
 * @property {number} played Fjöldi spilaðra leikja
 * @property {number} correct Fjöldi réttra svara
 * @property {number} incorrect Fjöldi rangra svara
 */

/**
 * Stokkar fylki.
 * @template T
 * @param {T[]} array Fylki sem á að stokka
 * @returns {T[]} Nýtt, stokkað fylki
 */
export function shuffle(array) {
  const copy = [...array];

  // Fisher-Yates stokkun
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

/**
 * Velur `count` spurningar af handahófi, engin spurning er valin oftar en einu sinni.
 * @param {Question[]} questions Allar spurningar
 * @param {number} count Fjöldi spurninga sem á að velja
 * @returns {Question[]} Valdar spurningar
 */
export function pickQuestions(questions, count) {
  return shuffle(questions).slice(0, count);
}

/**
 * Athugar hvort svar sé rétt.
 * Hunsar bil í byrjun og enda og há- og lágstafi.
 * @param {string} answer Svar notanda
 * @param {string} correctAnswer Rétt svar
 * @returns {boolean} `true` ef svar er rétt
 */
export function isCorrect(answer, correctAnswer) {
  return answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

/**
 * Býr til niðurstöður út frá spurningum og svörum notanda, í sömu röð.
 * @param {Question[]} questions Spurningar sem voru spurðar
 * @param {string[]} answers Svör notanda, í sömu röð og spurningar
 * @returns {Result[]} Niðurstöður
 */
export function createResults(questions, answers) {
  return questions.map((question, i) => {
    const answer = answers[i] ?? '';

    return {
      category: question.category,
      question: question.question,
      answer,
      correctAnswer: question.answer,
      correct: isCorrect(answer, question.answer),
    };
  });
}

/**
 * Telur fjölda réttra svara í niðurstöðum.
 * @param {Result[]} results Niðurstöður
 * @returns {number} Fjöldi réttra svara
 */
export function countCorrect(results) {
  return results.filter((result) => result.correct).length;
}

/**
 * Uppfærir tölfræði með niðurstöðum úr leik. Breytir ekki `stats`.
 * @param {Stats} stats Tölfræði fyrir leik
 * @param {Result[]} results Niðurstöður leiks
 * @returns {Stats} Ný tölfræði
 */
export function updateStats(stats, results) {
  const correct = countCorrect(results);

  return {
    played: stats.played + 1,
    correct: stats.correct + correct,
    incorrect: stats.incorrect + (results.length - correct),
  };
}
