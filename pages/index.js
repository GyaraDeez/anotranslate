import { useState } from "react";
import { engToAno, anoToEng } from "../utils/dictionary";
import { englishToAnorcan, anorcanToEnglish } from "../utils/translate";


export default function Home() {
  const [english, setEnglish] = useState("");
  const [anorcan, setAnorcan] = useState("");

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Anorcan ↔ English Translator</h1>

      <div style={{ display: "flex", gap: "2rem" }}>
        {/* English */}
        <div style={{ flex: 1 }}>
          <h2>English</h2>
          <textarea
            rows={8}
            style={{ width: "100%" }}
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
          />
        </div>

        {/* Anorcan */}
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
        <button
          onClick={() => setAnorcan(englishToAnorcan(english))}
          style={{ marginRight: "1rem" }}
        >
          English → Anorcan
        </button>

        <button
          onClick={() => setEnglish(anorcanToEnglish(anorcan))}
        >
          Anorcan → English
        </button>
      </div>
    </div>
  );
}
