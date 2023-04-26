import Head from "next/head";
import { useState, useEffect } from "react";
import { shuffle, cards } from "./api/cards";
import { CanvasComponent } from "../public/components/Animation";
import { LanguageSelector } from "../public/components/LanguageSelector";
import { DESCRIPTION, TITLE } from "../public/constants/constants";
import { TranslateObject } from "../public/components/TranslateObject";

function createMarkup(result) {
  return { __html: result };
}

const LoadingIcon = () => {
  return (
    <div className="loading-icon">
      <img
        className="loading-icon__spinner"
        src={"./src/images/loading_icon.png"}
      ></img>
    </div>
  );
};

export default function Home() {
  const languages = [
    { name: "en", icon: "./src/images/english.png" },
    { name: "fr", icon: "./src/images/french.png" },
  ];

  const [isLoading, setIsLoading] = useState(false);

  const [questionInput, setQuestionInput] = useState("");
  const [result, setResult] = useState();
  const [card1, setCard1] = useState("../src/images/back.jpg");
  const [card2, setCard2] = useState("../src/images/back.jpg");
  const [card3, setCard3] = useState("../src/images/back.jpg");
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  useEffect(() => {
    if (result) {
      return setIsLoading(false);
    }
  }, [result]);

  async function onSubmit(event) {
    setIsLoading(true);
    setResult();
    setCard1("../src/images/back.jpg");
    setCard2("../src/images/back.jpg");
    setCard3("../src/images/back.jpg");
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
        <link rel="icon" href="./src/images/icon.png" />
      </Head>

      <main className="container">
        <CanvasComponent className="canvas" />
        <div className="header">
          <h1>
            <TranslateObject object={TITLE} language={currentLanguage} />
          </h1>
          <div className="language-selector">
            <LanguageSelector
              languages={languages}
              onLanguageChange={setCurrentLanguage}
            />
          </div>
        </div>

        <img className="logo" src="./src/images/icon.png"></img>

        <div className="description">
          <TranslateObject object={DESCRIPTION} language={currentLanguage} />
        </div>
        <form onSubmit={onSubmit} className="input-container">
          <input
            type="text"
            name="question"
            placeholder="..."
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
