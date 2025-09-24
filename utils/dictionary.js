// utils/dictionary.js

export const engToAno = {
  i: "ima",
  me: "ima",
  you: "ka",
  we: "nu",
  he: "niya",
  she: "niya",
  it: "niya",
  they: "seni",

  this: "tei",
  that: "sa",
  house: "koro",
  food: "taka",
  rice: "fun",
  water: "awa",
  person: "mun",

  eat: "ese",
  sleep: "suni",
  see: "see",
  want: "wen",
  give: "gami",
  be: "nai",
  like: "rak",
  more: "tafi",
  not: "ta",

  big: "bara",
  small: "sina",
  good: "dee",
  bad: "bai",

  yes: "ya",
  no: "ta",
};

export const anoToEng = Object.fromEntries(
  Object.entries(engToAno).map(([k, v]) => [v, k])
);
