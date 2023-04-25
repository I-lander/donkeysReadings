import Head from "next/head";
import { useState, useEffect } from "react";
import { shuffle, cards } from "./api/cards";
import { CanvasComponent } from "../public/animation";
import { LanguageSelector } from "./languageSelector";

function createMarkup(result) {
  return { __html: result };
}

const LoadingIcon = () => {
  return (
    <div className="loading-icon">
      <div className="loading-icon__spinner"></div>
    </div>
  );
};

export default function Home() {
  const languages = [
    { name: "English", icon: "./src/english.png" },
    { name: "Français", icon: "./src/french.png" },
  ];

  const [isLoading, setIsLoading] = useState(false);

  const [questionInput, setQuestionInput] = useState("");
  const [result, setResult] = useState();
  const [card1, setCard1] = useState("../src/back.jpg");
  const [card2, setCard2] = useState("../src/back.jpg");
  const [card3, setCard3] = useState("../src/back.jpg");

  useEffect(() => {
    if (result) {
      return setIsLoading(false);
    }
  }, [result]);

  async function onSubmit(event) {
    setIsLoading(true);
    setResult();
    setCard1("../src/back.jpg");
    setCard2("../src/back.jpg");
    setCard3("../src/back.jpg");
    event.preventDefault();
    try {
      shuffle();
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: questionInput, cards: cards }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setCard1(cards[0].img);
      setCard2(cards[1].img);
      setCard3(cards[2].img);

      setResult(data.result);
      setQuestionInput("");
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      alert(error.message);
    }
  }
  return (
    <div>
      <Head>
        <title>Donkeys Readings</title>
        <link rel="stylesheet" href="style.css" />
        <link rel="icon" href="./src/icon.png" />
      </Head>

      <main className="container">
        <CanvasComponent className="canvas" />
        <div className="language-selector">
          <LanguageSelector languages={languages} />
        </div>
        <h1>Donkeys Readings</h1>
        <div className="description">
          Welcome to the Tarot Reading page! <br></br>Please ask a question and
          draw your cards to receive a personalized reading.
        </div>
        <form onSubmit={onSubmit} className="input-container">
          <input
            type="text"
            name="question"
            placeholder="Enter your question"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
          <button
            type="submit"
            className="submit-btn"
            value="Submit"
            disabled={isLoading}
          ></button>
        </form>

        <div className="cards-container">
          <div className="card" id="card1">
            <img className="card-image" src={card1}></img>
          </div>
          <div className="card" id="card2">
            <img className="card-image" src={card2}></img>
          </div>
          <div className="card" id="card3">
            <img className="card-image" src={card3}></img>
          </div>
        </div>
        <div className="reading-container">
          {" "}
          {isLoading ? (
            <LoadingIcon />
          ) : (
            <div dangerouslySetInnerHTML={createMarkup(result)}></div>
          )}
        </div>
      </main>
    </div>
  );
}
