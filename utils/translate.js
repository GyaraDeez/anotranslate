import { engToAno, anoToEng } from "./dictionary";

// List of adjectives (for noun-adjective swap)
const adjectives = [
  "big","small","good","bad","new","old","hot","cold","long","short",
  "strong","weak","peaceful","happy","sad","hard","soft","light","heavy",
  "bright","dark","thick","thin","sharp","round","flat","smooth"
];

// Grammar particles for reference
const particles = ["na","ta","ya","kae","ni","de","sa","ma","to","ku"];

export function englishToAnorcan(sentence) {
  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  // Convert each word using dictionary, flatten multi-word translations
  let converted = words
    .map((w) => {
      const translation = engToAno[w];
      if (!translation) return w;
      return translation.includes(" ") ? translation.split(" ") : translation;
    })
    .flat();

  // Move adjectives after nouns
  for (let i = 0; i < converted.length - 1; i++) {
    const engWord = Object.keys(engToAno).find((k) => engToAno[k] === converted[i]);
    const engNext = Object.keys(engToAno).find((k) => engToAno[k] === converted[i + 1]);
    if (adjectives.includes(engWord) && engNext && !adjectives.includes(engNext)) {
      [converted[i], converted[i + 1]] = [converted[i + 1], converted[i]];
      i++; // skip next to avoid double swap
    }
  }

  // Simple VSO: if at least 3 words, swap first two (SVO → VSO)
  if (converted.length >= 3) {
    const [subj, verb, ...obj] = converted;
    if (engToAno[verb]) {
      converted = [verb, subj, ...obj];
    }
  }

  // Apply negation "ta" before verb if present
  for (let i = 0; i < converted.length; i++) {
    if (converted[i] === "ta" && converted[i + 1]) {
      converted[i] = "ta";
      converted[i + 1] = converted[i + 1]; // keep verb next
    }
  }

  // Add "na" if the original sentence was a question
  if (sentence.trim().endsWith("?") && !converted.includes("na")) {
    converted.push("na");
  }

  return converted.join(" ");
}

export function anorcanToEnglish(sentence) {
  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  // Remove question marker "na" if present
  if (words[words.length - 1] === "na") words.pop();

  // Map Anorcan → English, handle multi-word like "tafi rak" → "love"
  let converted = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i] === "tafi" && words[i + 1] === "rak") {
      converted.push("love");
      i++; // skip next
    } else if (particles.includes(words[i])) {
      converted.push(words[i]); // leave particles as-is
    } else {
      converted.push(anoToEng[words[i]] || words[i]);
    }
  }

  // Restore SVO from VSO if applicable
  if (converted.length >= 3) {
    const [verb, subj, ...obj] = converted;
    if (anoToEng[verb] && !particles.includes(verb)) {
      converted = [subj, verb, ...obj];
    }
  }

  return converted.join(" ");
}
