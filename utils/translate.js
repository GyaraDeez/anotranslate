import { engToAno, anoToEng } from "./dictionary";

// Helper: check if a word is an adjective
const adjectives = ["big", "small", "good", "bad"];

export function englishToAnorcan(sentence) {
  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  // Handle "I love" → "ima tafi rak"
  if (words.includes("love")) {
    words = words.map(w => (w === "love" ? "more like" : w));
  }

  // Convert each word with dictionary
  let converted = words.map(w => engToAno[w] || w);

  // Simple heuristic for SVO → VSO
  // English: I eat food → Anorcan: eat I food
  if (converted.length >= 3) {
    const [subj, verb, ...obj] = converted;
    if (engToAno[verb]) {
      converted = [engToAno[verb], engToAno[subj] || subj, ...obj];
    }
  }

  // Negation: "not eat" → "ta ese"
  converted = converted.map((w, i) => {
    if (w === "ta" && converted[i + 1]) {
      return "ta " + converted[i + 1];
    }
    return w;
  });

  // Move adjectives after nouns
  for (let i = 0; i < converted.length - 1; i++) {
    if (adjectives.includes(anoToEng[converted[i]])) {
      // swap
      [converted[i], converted[i - 1]] = [converted[i - 1], converted[i]];
    }
  }

  let result = converted.join(" ");

  // Add "na" if it’s a question
  if (sentence.trim().endsWith("?")) {
    result += " na";
  }

  return result.trim();
}

export function anorcanToEnglish(sentence) {
  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);
  let converted = words.map(w => anoToEng[w] || w);

  // Fix VSO back to SVO if possible
  if (converted.length >= 3) {
    const [verb, subj, ...obj] = converted;
    if (anoToEng[verb]) {
      converted = [subj, verb, ...obj];
    }
  }

  // Handle "tafi rak" → "love"
  for (let i = 0; i < converted.length; i++) {
    if (converted[i] === "more" && converted[i + 1] === "like") {
      converted[i] = "love";
      converted.splice(i + 1, 1);
    }
  }

  let result = converted.join(" ");

  // Add
