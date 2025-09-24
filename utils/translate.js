import { engToAno, anoToEng } from "./dictionary";

// List of adjectives (optional, currently not used to preserve round-trip order)
const adjectives = [
  "big","small","good","bad","new","old","hot","cold","long","short",
  "strong","weak","peaceful","happy","sad","hard","soft","light","heavy",
  "bright","dark","thick","thin","sharp","round","flat","smooth"
];

// Grammar particles
const particles = ["na","ta","ya","kae","ni","de","sa","ma","to","ku"];

/**
 * Translate English sentence to Anorcan
 * Handles:
 * - Multi-word translations (like "love" → "tafi rak")
 * - VSO order (verbs before subject)
 * - Negation "ta" before verbs
 * - Question marker "na"
 */
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

  // VSO: swap first two words if sentence has at least 3 words
  if (converted.length >= 3) {
    const [subj, verb, ...obj] = converted;
    if (engToAno[verb]) {
      converted = [verb, subj, ...obj];
    }
  }

  // Apply negation "ta" before verb if present
  for (let i = 0; i < converted.length; i++) {
    if (converted[i] === "ta" && converted[i + 1]) {
      converted[i] = "ta"; // stays in place
    }
  }

  // Add question marker "na" if sentence ends with "?"
  if (sentence.trim().endsWith("?") && !converted.includes("na")) {
    converted.push("na");
  }

  return converted.join(" ");
}

/**
 * Translate Anorcan sentence to English
 * Handles:
 * - Multi-word translations (like "tafi rak" → "love")
 * - Particles
 * - VSO → SVO restoration
 */
export function anorcanToEnglish(sentence) {
  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  // Remove question marker "na" at end
  if (words[words.length - 1] === "na") words.pop();

  let converted = [];

  // Map Anorcan → English, handle multi-word translations
  for (let i = 0; i < words.length; i++) {
    // Handle "tafi rak" → "love"
    if (words[i] === "tafi" && words[i + 1] === "rak") {
      converted.push("love");
      i++; // skip next word
    } 
    // Keep grammar particles as-is
    else if (particles.includes(words[i])) {
      converted.push(words[i]);
    } 
    // Map using dictionary
    else {
      converted.push(anoToEng[words[i]] || words[i]);
    }
  }

  // Restore SVO from VSO if possible
  if (converted.length >= 3) {
    const [verb, subj, ...obj] = converted;
    if (anoToEng[verb] && !particles.includes(verb)) {
      converted = [subj, verb, ...obj];
    }
  }

  return converted.join(" ");
}
