import Head from "next/head";
import { useState } from "react";
import { shuffle, cards } from "./api/cards";

export default function Home() {
  const [questionInput, setQuestionInput] = useState("");
  const [result, setResult] = useState();
  const [card1, setCard1] = useState("Card 1");
  const [card2, setCard2] = useState("Card 2");
  const [card3, setCard3] = useState("Card 3");

  async function onSubmit(event) {

    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: questionInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setCard1(cards[0].name);
      setCard2(cards[1].name);
      setCard3(cards[2].name);

      setResult(data.result);
      setQuestionInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Tarot Reading</title>
        <link rel="stylesheet" href="style.css" />
      </Head>

      <main className="container">
        <h1>Tarot Reading</h1>
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
          <input type="submit" className="submit-btn" value="Submit" />
        </form>

        <div className="cards-container">
          <div className="card" id="card1">
            {card1}
          </div>
          <div className="card" id="card2">
            {card2}
          </div>
          <div className="card" id="card3">
            {card3}
          </div>
        </div>
        <div className="reading-container">{result}</div>
      </main>
    </div>
  );
}
