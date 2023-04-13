import { Configuration, OpenAIApi } from "openai";
import { shuffle, cards } from "./cards";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const question = req.body.question || "";
  if (question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(question),
      temperature: 1,
      max_tokens: 310,
    });
    console.log(completion);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(question) {
  shuffle();

  const capitalizedQuestion =
    question[0].toUpperCase() + question.slice(1).toLowerCase();
  console.log("xxxxxxxxxxxxxxxxxxxxx");
  return `Question: ${question}\nCard 1: ${cards[0].name}\nCard 2: ${cards[1].name}\nCard 3: ${cards[2].name}. Use only these cards to build the reading. The answer must use the language used in the question.`;
  // return `Please provide a tarot reading for the following question: ${question}. The answer must use the language used in the question. Start the answer without introduction`;
}
