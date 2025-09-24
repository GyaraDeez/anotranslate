// utils/translate.js
import dictionary from "./dictionary";

// List of adjectives for noun-adjective swap
const adjectives = [
  "big","small","good","bad","new","old","hot","cold","long","short",
  "strong","weak","peaceful","happy","sad","hard","soft","light","heavy",
  "bright","dark","thick","thin","sharp","round","flat","smooth"
];

// Grammar particles
const particles = ["na", "ta", "ya", "kae", "ni", "de", "sa", "ma", "to", "ku"];

// English → Anorcan
export function englishToAnorcan(sentence) {
  if (!sentence) return "";

  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  let converted = words
    .map((w) => {
      let base = w;

      // Handle plurals for nouns (strip 's')
      if (w.endsWith("s") && dictionary[w.slice(0, -1)]) base = w.slice(0, -1);
      // Handle 3rd person singular verbs (strip 's')
      else if (w.endsWith("s") && dictionary[w.slice(0, -1)]) base = w.slice(0, -1);

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

  // VSO: find first verb and move it to start
  for (let i = 0; i < converted.length; i++) {
    const engWord = words[i];
    if (["be","exist","like","love","eat","drink","go","come","do","make","want","need","give","take","say","speak","know","see","hear","sleep","think","feel","walk","live","stay"].includes(engWord)) {
      const verb = converted.splice(i, 1)[0];
      converted.unshift(verb);
      break;
    }
  }

  // Add question marker "na"
  if (sentence.trim().endsWith("?") && !converted.includes("na")) {
    converted.push("na");
  }

  return converted.join(" ");
}

// Anorcan → English
export function anorcanToEnglish(sentence) {
  if (!sentence) return "";

  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  // Remove question marker at the end
  if (words[words.length - 1] === "na") words.pop();

  let converted = [];
  for (let i = 0; i < words.length; i++) {
    // Handle multi-word translations (e.g., "tafi rak" → "love")
    if (words[i] === "tafi" && words[i + 1] === "rak") {
      converted.push("love");
      i++;
    }
    // Keep particles as-is
    else if (particles.includes(words[i])) {
      converted.push(words[i]);
    }
    // Lookup in dictionary
    else {
      const eng = Object.keys(dictionary).find(k => dictionary[k] === words[i]);
      converted.push(eng || words[i]);
    }
  }

  // Restore SVO: if sentence has 3+ words and first word is verb
  if (converted.length >= 3) {
    const [verb, subj, ...obj] = converted;
    if (["be","exist","like","love","eat","drink","go","come","do","make","want","need","give","take","say","speak","know","see","hear","sleep","think","feel","walk","live","stay"].includes(verb)) {
      converted = [subj, verb, ...obj];
    }
  }

  return converted.join(" ");
}
