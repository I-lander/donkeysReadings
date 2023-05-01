import Head from "next/head";
import { useState, useEffect } from "react";
import { shuffle, cards } from "../public/constants/cards";
import { AppVisibilityButton } from "../components/AppVisibilityButton";
import { CanvasBlock } from "../components/CanvasBlock";
import { LanguageSelector } from "../components/LanguageSelector";
import { TranslateObject, getPlaceholderText } from "../components/TranslateObject";

import { DESCRIPTION, INTRODUCTION } from "../public/constants/constants";
import { CaptireButton, ReadingBlock } from "../components/ReadingBlock.js";

export default function Home() {
  const languages = [
    { code: "en", icon: "./src/images/english.png" },
    { code: "fr", icon: "./src/images/french.png" },
  ];

  const [isLoading, setIsLoading] = useState(false);

  const [questionInput, setQuestionInput] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");
  const [question, setQuestion] = useState();
  const [result, setResult] = useState();
  const [card1, setCard1] = useState("../src/images/cards/back.png");
  const [card2, setCard2] = useState("../src/images/cards/back.png");
  const [card3, setCard3] = useState("../src/images/cards/back.png");
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [appVisible, setAppVisible] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

  useEffect(() => {
    if (result) {
      return setIsLoading(false);
    }
  }, [result]);

  useEffect(() => {
    setPlaceholderText(getPlaceholderText(currentLanguage.code));
  }, [currentLanguage]);

  function toggleAppVisibility() {
    setHeaderCollapsed(!headerCollapsed);
    setAppVisible(!appVisible);
  }

  async function onSubmit(event) {
    setIsLoading(true);
    setResult();
    setCard1("../src/images/cards/back.png");
    setCard2("../src/images/cards/back.png");
    setCard3("../src/images/cards/back.png");
    setQuestion(questionInput)
    event.preventDefault();
    try {
      shuffle();
      const response = await fetch("/api/generateReading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: questionInput,
          cards: cards,
          lang: currentLanguage.code,
        }),
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
        <CanvasBlock className="canvas" />

        <div className={`header ${headerCollapsed ? "header--collapsed" : ""}`}>
          <div className="header-content">
            <img className="logo" src="./src/images/icon.png"></img>
            <div className="language-selector">
              <LanguageSelector
                languages={languages}
                onLanguageChange={setCurrentLanguage}
              />
            </div>
          </div>
          <div className="description">
            <div className="introduction">
              <TranslateObject
                object={INTRODUCTION}
                language={currentLanguage}
              />
            </div>
            <br />
            <br />
            <TranslateObject object={DESCRIPTION} language={currentLanguage} />
          </div>
          {!appVisible ? (
            <AppVisibilityButton
              appVisible={appVisible}
              toggleAppVisibility={toggleAppVisibility}
            />
          ) : (
            ""
          )}
        </div>

        <div className={`app ${appVisible ? "app--visible" : ""}`}>
          <form onSubmit={onSubmit} className="input-container">
            <input
              type="text"
              name="question"
              placeholder={placeholderText}
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
          <ReadingBlock
            card1={card1}
            card2={card2}
            card3={card3}
            isLoading={isLoading}
            question={question}
            result={result}
          />
        </div>
        {appVisible ? (
          <AppVisibilityButton
            appVisible={appVisible}
            toggleAppVisibility={toggleAppVisibility}
          />
        ) : (
          ""
        )}
      </main>
    </div>
  );
}
