import React, { useState } from "react";
import countries from "../countries";

function Translator() {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromLang, setFromLang] = useState("en-GB");
  const [toLang, setToLang] = useState("hi-IN");
  const [loading, setLoading] = useState(false);

  const handleExchange = () => {
    setFromText(toText);
    setToText(fromText);
    setFromLang(toLang);
    setToLang(fromLang);
  };

  const handleTranslate = async () => {
    if (!fromText.trim()) return;
    setLoading(true);
    setToText("");

    let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      fromText
    )}&langpair=${fromLang}|${toLang}`;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      let translation = data.responseData.translatedText;

      data.matches.forEach((match) => {
        if (match.id === 0) {
          translation = match.translation;
        }
      });

      setToText(translation);
    } catch (error) {
      setToText("Translation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="container">
      <h2>Text Translator</h2>
      <div className="wrapper">
        <div className="text-input">
          <textarea
            spellCheck="false"
            className="from-text"
            placeholder="Enter text"
            value={fromText}
            onChange={(e) => setFromText(e.target.value)}
          ></textarea>
          <textarea
            spellCheck="false"
            readOnly
            disabled
            className="to-text"
            placeholder={loading ? "Translating..." : "Translated Text"}
            value={toText}
          ></textarea>
        </div>
        <ul className="controls">
          <li className="row from">
            <div className="icons">
              <i
                className="fas fa-copy"
                onClick={() => handleCopy(fromText)}
              ></i>
            </div>
            <select value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
              {Object.entries(countries).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </li>
          <li className="exchange">
            <i className="fas fa-exchange-alt" onClick={handleExchange}></i>
          </li>
          <li className="row to">
            <select value={toLang} onChange={(e) => setToLang(e.target.value)}>
              {Object.entries(countries).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            <div className="icons">
              <i className="fas fa-copy" onClick={() => handleCopy(toText)}></i>
            </div>
          </li>
        </ul>
      </div>
      <button onClick={handleTranslate}>Translate</button>
    </div>
  );
}

export default Translator;
