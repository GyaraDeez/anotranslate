// utils/translate.js
import dictionary from "./dictionary";

// Grammar particles for reference
const particles = ["na", "ta", "ya", "kae", "ni", "de", "sa", "ma", "to", "ku"];

// List of verbs (for VSO and singular normalization)
const verbs = [
  "be","exist","like","love","eat","drink","go","come","do","make",
  "want","need","give","take","say","speak","know","see","hear",
  "sleep","think","feel","walk","live","stay"
];

// List of adjectives (for noun-adjective order)
const adjectives = [
  "big","small","good","bad","new","old","hot","cold","long","short",
  "many","few","strong","weak","peaceful","happy","sad","hard","soft","more"
];

/**
 * Translate English → Anorcan
 * @param {string} sentence
 * @returns {string}
 */
export function englishToAnorcan(sentence) {
  if (!sentence) return "";

  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  // Convert each word using dictionary, flatten multi-word translations
  let converted = words
    .map((w) => {
      // Normalize 3rd person singular: likes → like, eats → eat
      let base = w;
      if (base.endsWith("s") && verbs.includes(base.slice(0, -1))) {
        base = base.slice(0, -1);
      }
      const translation = dictionary[base] || base;
      return translation.includes(" ") ? translation.split(" ") : translation;
    })
    .flat();

  // Move adjectives after nouns
  for (let i = 0; i < converted.length - 1; i++) {
    const engWord = Object.keys(dictionary).find(k => dictionary[k] === converted[i]);
    const engNext = Object.keys(dictionary).find(k => dictionary[k] === converted[i + 1]);
    if (adjectives.includes(engWord) && engNext && !adjectives.includes(engNext)) {
      [converted[i], converted[i + 1]] = [converted[i + 1], converted[i]];
      i++; // skip next to avoid double swap
    }
  }

  // VSO: move first verb to front if sentence has 3+ words
  if (converted.length >= 3) {
    for (let i = 0; i < converted.length; i++) {
      const engWord = Object.keys(dictionary).find(k => dictionary[k] === converted[i]);
      if (verbs.includes(engWord)) {
        const verb = converted.splice(i, 1)[0];
        converted.unshift(verb);
        break;
      }
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
 * @param {string} sentence
 * @returns {string}
 */
export function anorcanToEnglish(sentence) {
  if (!sentence) return "";

  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  // Remove question marker at the end
  if (words[words.length - 1] === "na") words.pop();

  let converted = [];
  for (let i = 0; i < words.length; i++) {
    // Handle "tafi rak" → "love"
    if (words[i] === "tafi" && words[i + 1] === "rak") {
      converted.push("love");
      i++;
    } 
    else if (particles.includes(words[i])) {
      converted.push(words[i]);
    } 
    else {
      const eng = Object.keys(dictionary).find(k => dictionary[k] === words[i]);
      converted.push(eng || words[i]);
    }
  }

  // Restore SVO if sentence has 3+ words
  if (converted.length >= 3) {
    for (let i = 0; i < converted.length; i++) {
      if (verbs.includes(converted[i])) {
        const verb = converted.splice(i, 1)[0];
        converted.splice(1, 0, verb); // put after subject
        break;
      }
    }
  }

  return converted.join(" ");
}
