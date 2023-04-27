import { Configuration, OpenAIApi } from "openai";

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

  const { question, cards, lang } = req.body;
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
      prompt: generatePrompt(question, cards, lang),
      temperature: 0.8,
      max_tokens: 640,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
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

function generatePrompt(question, cards, lang) {
  if (lang === "en") {
    return `Please provide a tarot reading using the following cards with proper line breaks between each interpretation, and include a summary that combines the 3 cards and the previous reading: Question: ${question}\nCard 1: ${cards[0].nameEn}\nCard 2: ${cards[1].nameEn}\nCard 3: ${cards[2].nameEn}\nUse only these cards to build the reading.`;
  }
  if (lang === "fr") {
    return `Veuillez fournir une lecture de tarot en utilisant les cartes suivantes avec des sauts de ligne appropriés entre chaque interprétation, et inclure un résumé qui combine les 3 cartes et la lecture précédente : Question : ${question}\nCarte 1 : ${cards[0].nameFr}\nCarte 2 : ${cards[1].nameFr}\nCarte 3 : ${cards[2].nameFr}\nUtilisez uniquement ces cartes pour construire la lecture.`;
  }
  
}
