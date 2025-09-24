// utils/translate.js
import dictionary from "./dictionary";

// Build reverse dictionary for Anorcan → English
const anoToEng = Object.fromEntries(
  Object.entries(dictionary).map(([k, v]) => [v, k])
);

// Grammar particles
const particles = ["na", "ta", "ya", "kae", "ni", "de", "sa", "ma", "to", "ku"];

/**
 * Translate English → Anorcan
 * @param {string} sentence - English sentence
 * @returns {string} - Anorcan translation
 */
export function englishToAnorcan(sentence) {
  if (!sentence) return "";

  // Lowercase & remove punctuation
  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  // Convert words using dictionary
  let converted = words
    .map((w) => {
      const translation = dictionary[w] || dictionary[w.toLowerCase()];
      if (!translation) return w;
      return translation.includes(" ") ? translation.split(" ") : translation;
    })
    .flat();

  // VSO: swap first two words if sentence has >=3 words
  if (converted.length >= 3) {
    const [subj, verb, ...obj] = converted;
    if (dictionary[verb]) converted = [verb, subj, ...obj];
  }

  // Add question marker "na" if sentence ends with "?"
  if (sentence.trim().endsWith("?") && !converted.includes("na")) {
    converted.push("na");
  }

  return converted.join(" ");
}

/**
 * Translate Anorcan → English
 * @param {string} sentence - Anorcan sentence
 * @returns {string} - English translation
 */
export function anorcanToEnglish(sentence) {
  if (!sentence) return "";

  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  // Remove question marker at end
  if (words[words.length - 1] === "na") words.pop();

  let converted = [];
  for (let i = 0; i < words.length; i++) {
    // Multi-word "tafi rak" → "love"
    if (words[i] === "tafi" && words[i + 1] === "rak") {
      converted.push("love");
      i++;
    } 
    else if (particles.includes(words[i])) {
      converted.push(words[i]);
    } 
    else {
      converted.push(anoToEng[words[i]] || words[i]);
    }
  }

  // Restore SVO from VSO if sentence >=3 words
  if (converted.length >= 3) {
    const [verb, subj, ...obj] = converted;
    if (anoToEng[verb] && !particles.includes(verb)) converted = [subj, verb, ...obj];
  }

  return converted.join(" ");
}
