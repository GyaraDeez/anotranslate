// utils/translate.js
import dictionary from "./dictionary";

// List of adjectives (for noun-adjective swap)
const adjectives = [
  "big","small","good","bad","new","old","hot","cold","long","short",
  "strong","weak","peaceful","happy","sad","hard","soft","more"
];

// Grammar particles
const particles = ["na", "ta", "ya", "kae", "ni", "de", "sa", "ma", "to", "ku"];

// Extract English words for plural checks
const nouns = Object.keys(dictionary).filter(
  (k) => !["na","ta","ya","kae","ni","de","sa","ma","to","ku"].includes(k)
);

/**
 * Translate English → Anorcan
 * @param {string} sentence
 * @returns {string}
 */
export function englishToAnorcan(sentence) {
  if (!sentence) return "";

  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  let converted = words
    .map((w) => {
      let base = w;

      // Strip plural 's' for nouns if base exists
      if (w.endsWith("s") && nouns.includes(w.slice(0, -1))) {
        base = w.slice(0, -1);
      }
      // Strip 's' for 3rd person singular verbs if base exists
      else if (w.endsWith("s") && dictionary[w.slice(0, -1)]) {
        base = w.slice(0, -1);
      }

      const translation = dictionary[base] || dictionary[base.toLowerCase()];
      if (!translation) return w;
      return translation.includes(" ") ? translation.split(" ") : translation;
    })
    .flat();

  // Move adjectives after nouns
  for (let i = 0; i < converted.length - 1; i++) {
    const engWord = Object.keys(dictionary).find((k) => dictionary[k] === converted[i]);
    const engNext = Object.keys(dictionary).find((k) => dictionary[k] === converted[i + 1]);
    if (adjectives.includes(engWord) && engNext && !adjectives.includes(engNext)) {
      [converted[i], converted[i + 1]] = [converted[i + 1], converted[i]];
      i++;
    }
  }

  // VSO: if sentence has 3+ words
  if (converted.length >= 3) {
    const [subj, verb, ...obj] = converted;
    if (dictionary[verb]) {
      converted = [verb, subj, ...obj];
    }
  }

  // Add question marker
  if (sentence.trim().endsWith("?") && !converted.includes("na")) {
    converted.push("na");
  }

  return converted.join(" ");
}

/**
 * Translate Anorcan → English
 * @param {string} sentence
 * @returns {string}
 */
export function anorcanToEnglish(sentence) {
  if (!sentence) return "";

  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  // Remove question marker
  if (words[words.length - 1] === "na") words.pop();

  let converted = [];
  for (let i = 0; i < words.length; i++) {
    // Multi-word: "tafi rak" → "love"
    if (words[i] === "tafi" && words[i + 1] === "rak") {
      converted.push("love");
      i++;
    } 
    // Keep particles as-is
    else if (particles.includes(words[i])) {
      converted.push(words[i]);
    } 
    else {
      converted.push(Object.keys(dictionary).find(k => dictionary[k] === words[i]) || words[i]);
    }
  }

  // Restore SVO from VSO if sentence has 3+ words
  if (converted.length >= 3) {
    const [verb, subj, ...obj] = converted;
    if (!particles.includes(verb)) {
      converted = [subj, verb, ...obj];
    }
  }

  return converted.join(" ");
}
