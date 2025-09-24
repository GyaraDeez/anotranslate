import { engToAno, anoToEng } from "./dictionary";

// List of adjectives in English (must match dictionary)
const adjectives = ["big", "small", "good", "bad"];

export function englishToAnorcan(sentence) {
  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  // Handle "love" → "tafi rak"
  words = words.map((w) => (w === "love" ? ["tafi", "rak"] : w)).flat();

  // Convert each word using dictionary
  let converted = words.map((w) => engToAno[w] || w);

  // Move adjectives after nouns
  for (let i = 0; i < converted.length - 1; i++) {
    const engWord = Object.keys(engToAno).find((k) => engToAno[k] === converted[i]);
    const engNext = Object.keys(engToAno).find((k) => engToAno[k] === converted[i + 1]);
    if (adjectives.includes(engWord) && engNext && !adjectives.includes(engNext)) {
      // Swap adjective with noun
      [converted[i], converted[i + 1]] = [converted[i + 1], converted[i]];
      i++; // skip next to avoid double swap
    }
  }

  // Apply simple VSO: if at least 3 words, swap first two (SVO → VSO)
  if (converted.length >= 3) {
    const [subj, verb, ...obj] = converted;
    if (engToAno[verb]) {
      converted = [verb, subj, ...obj];
    }
  }

  // Add "na" if sentence was a question
  if (sentence.trim().endsWith("?")) {
    converted.push("na");
  }

  return converted.join(" ");
}

export function anorcanToEnglish(sentence) {
  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  // Remove "na" if present
  if (words[words.length - 1] === "na") words.pop();

  // Map words back to English
  let converted = [];
  for (let i = 0; i < words.length; i++) {
    // Handle tafi rak → love
    if (words[i] === "tafi" && words[i + 1] === "rak") {
      converted.push("love");
      i++; // skip next
    } else {
      converted.push(anoToEng[words[i]] || words[i]);
    }
  }

  // SVO restoration from VSO
  if (converted.length >= 3) {
    const [verb, subj, ...obj] = converted;
    if (anoToEng[verb]) {
      converted = [subj, verb, ...obj];
    }
  }

  return converted.join(" ");
}
