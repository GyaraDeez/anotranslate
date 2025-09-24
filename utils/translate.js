// utils/translate.js
import { engToAno, anoToEng } from "./dictionary";

// Grammar particles for reference
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

  // Convert each word using dictionary
  let converted = words
    .map((w) => {
      const translation = engToAno[w];
      if (!translation) return w;
      return translation.includes(" ") ? translation.split(" ") : translation;
    })
    .flat();

  // VSO: If 3+ words, swap first two (SVO → VSO)
  if (converted.length >= 3) {
    const [subj, verb, ...obj] = converted;
    if (engToAno[verb]) {
      converted = [verb, subj, ...obj];
    }
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

  // Remove question marker "na" at the end
  if (words[words.length - 1] === "na") words.pop();

  let converted = [];
  for (let i = 0; i < words.length; i++) {
    // Multi-word translation: "tafi rak" → "love"
    if (words[i] === "tafi" && words[i + 1] === "rak") {
      converted.push("love");
      i++; // skip next
    } 
    // Keep particles as-is
    else if (particles.includes(words[i])) {
      converted.push(words[i]);
    } 
    // Lookup in dictionary
    else {
      converted.push(anoToEng[words[i]] || words[i]);
    }
  }

  // Restore SVO if sentence has 3+ words (VSO → SVO)
  if (converted.length >= 3) {
    const [verb, subj, ...obj] = converted;
    if (anoToEng[verb] && !particles.includes(verb)) {
      converted = [subj, verb, ...obj];
    }
  }

  return converted.join(" ");
}
