import { useState } from "react";
import { engToAno, anoToEng } from "../utils/dictionary";

export default function Home() {
  const [english, setEnglish] = useState("");
  const [anorcan, setAnorcan] = useState("");

  // Simple word-for-word translator
  const translateEngToAno = () => {
    const words = english.toLowerCase().split(/\s+/);
    const translated = words.map(w => engToAno[w] || w).join(" ");
    setAnorcan(translated);
  };

  const translateAnoToEng = () => {
    const words = anorcan.toLowerCase().split(/\s+/);
    const translated = words.map(w => anoToEng[w] || w).join(" ");
    setEnglish(translated);
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Anorcan ↔ English Translator</h1>
      <div style={{ display: "flex", gap: "2rem" }}>
        {/* English input */}
        <div style={{ flex: 1 }}>
          <h2>English</h2>
          <textarea
            rows={8}
            style={{ width: "100%" }}
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
          />
        </div>

        {/* Anorcan input */}
        <div style={{ flex: 1 }}>
          <h2>Anorcan</h2>
          <textarea
            rows={8}
            style={{ width: "100%" }}
            value={anorcan}
            onChange={(e) => setAnorcan(e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={translateEngToAno} style={{ marginRight: "1rem" }}>
          English → Anorcan
        </button>
        <button onClick={translateAnoToEng}>Anorcan → English</button>
      </div>
    </div>
  );
}
