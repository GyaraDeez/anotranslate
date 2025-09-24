// utils/translate.js

// Grammar particles
const particles = ["na","ta","ya","kae","ni","de","sa","ma","to","ku"];

/**
 * English → Anorcan translation
 * @param {string} sentence - English sentence
 * @param {object} engToAno - Loaded dictionary object
 * @returns {string} Anorcan translation
 */
export function englishToAnorcan(sentence, engToAno) {
  if (!engToAno) return sentence; // fallback

  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  // Convert each word using dictionary, flatten multi-word translations
  let converted = words
    .map((w) => {
      const translation = engToAno[w];
      if (!translation) return w;
      return translation.includes(" ") ? translation.split(" ") : translation;
    })
    .flat();

  // VSO: if at least 3 words, swap first two (SVO → VSO)
  if (converted.length >= 3) {
    const [subj, verb, ...obj] = converted;
    if (engToAno[verb]) {
      converted = [verb, subj, ...obj];
    }
  }

  // Negation "ta" before verbs
  for (let i = 0; i < converted.length; i++) {
    if (converted[i] === "ta" && converted[i + 1]) {
      converted[i] = "ta"; // stays
    }
  }

  // Add question marker "na" if sentence ends with "?"
  if (sentence.trim().endsWith("?") && !converted.includes("na")) {
    converted.push("na");
  }

  return converted.join(" ");
}

/**
 * Anorcan → English translation
 * @param {string} sentence - Anorcan sentence
 * @param {object} engToAno - Loaded dictionary object
 * @returns {string} English translation
 */
export function anorcanToEnglish(sentence, engToAno) {
  if (!engToAno) return sentence;

  const anoToEng = Object.fromEntries(
    Object.entries(engToAno).map(([k, v]) => [v, k])
  );

  let words = sentence.toLowerCase().replace(/[?!.]/g, "").split(/\s+/);

  // Remove question marker "na" at end
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

/**
 * Load all dictionary batches dynamically from /public/data
 * @param {number} batches - Number of JSON batches to load
 * @returns {Promise<{engToAno: object, anoToEng: object}>}
 */
export async function loadDictionaries(batches = 10) {
  let engToAno = {};

  for (let i = 1; i <= batches; i++) {
    const res = await fetch(`/data/engToAno_batch${i}.json`);
    if (res.ok) {
      const batch = await res.json();
      engToAno = { ...engToAno, ...batch };
    } else {
      console.warn(`Failed to load batch ${i}`);
    }
  }

  const anoToEng = Object.fromEntries(
    Object.entries(engToAno).map(([k, v]) => [v, k])
  );

  return { engToAno, anoToEng };
}
