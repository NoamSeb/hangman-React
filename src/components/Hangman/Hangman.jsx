import React, { useEffect, useState } from "react";
import { Svg } from "../svg/Svg";
import "./Hangman.css";

export default function Hangman({ duration = 120000 }) {
  const API_URL = "http://localhost:3001";
  const [word, setWord] = useState("");

  useEffect(() => {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "locale = en-EN",
    })
      .then((res) => res.json())
      .then((data) => {
        setWord(data.word.toUpperCase());
      });
  }, []);

  const alphabets = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [timeUp, setTimeUp] = useState(false);
  const [errors, setErrors] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeUp(true);
    }, duration);
    return () => clearTimeout(timeout);
  }, []);

  const maskedWord = word
    .split("")
    .map((letter) => (correctGuesses.includes(letter) ? letter : "_"))
    .join(" ");
  return (
    <div className="Game">
      <h1>Hangman</h1>
      <h2>You have two minute to find the word ! Good luck ! </h2>
      <div className="word">
        <p>{maskedWord}</p>
        {<p>Vous avez trouvez les lettres : {correctGuesses}</p>}
        {<p>You have done {errors} mistakes on 11.</p>}
        {timeUp || errors === 11 ? (
          <p className="lose">You lost ! The word was : {word}.</p>
        ) : (
          !maskedWord.includes("_") && <p className="win">You won !</p>
        )}
      </div>
      <div className="gameContent">
        <Svg errors={errors} />
        {alphabets.map((alphabet, index) => (
          <button
            key={index}
            onClick={(e) => {
              if (!timeUp && errors < 11) {
                if (word.includes(alphabet)) {
                  setCorrectGuesses([...correctGuesses, alphabet]);
                } else {
                  if (errors < 11) {
                    setErrors(errors + 1);
                  }
                }
                e.target.disabled = true;
              }
            }}
          >
            {alphabet}
          </button>
        ))}
      </div>
        <a href="./">
          <button className="playAgain">PLAY AGAIN</button>
        </a>
    </div>
  );
}