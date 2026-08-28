import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import OpenAI from 'openai';

interface DrawnCard {
  nameEn: string;
  nameFr: string;
}

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/generateReading', async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const { question, cards, lang } = req.body as {
    question?: string;
    cards?: DrawnCard[];
    lang?: string;
  };

  if (!question || question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid question',
      },
    });
    return;
  }

  if (!Array.isArray(cards) || cards.length < 3) {
    res.status(400).json({
      error: {
        message: 'Three cards are required to generate a reading',
      },
    });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: generatePrompt(question, cards, lang) }],
      temperature: 0.8,
      max_tokens: 640,
    });
    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status, error.message);
      res.status(error.status ?? 500).json({ error: { message: error.message } });
    } else {
      console.error(`Error with OpenAI API request: ${(error as Error).message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
});

function generatePrompt(question: string, cards: DrawnCard[], lang?: string): string {
  if (lang === 'fr') {
    return `Veuillez fournir une lecture de tarot en utilisant les cartes suivantes avec des sauts de ligne appropriés entre chaque interprétation, et inclure une synthèse complète permettant de lier les 3 cartes ensemble : Question : ${question}\nCarte 1 : ${cards[0].nameFr}\nCarte 2 : ${cards[1].nameFr}\nCarte 3 : ${cards[2].nameFr}\nUtilisez uniquement ces cartes pour construire la lecture.`;
  }

  return `Please provide a tarot reading using the following cards, with appropriate line breaks between each interpretation, and include a comprehensive synthesis that ties the 3 cards together: Question: ${question}\nCard 1: ${cards[0].nameEn}\nCard 2: ${cards[1].nameEn}\nCard 3: ${cards[2].nameEn}\nUse only these cards to construct the reading.`;
}

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`Donkeys Readings API listening on http://localhost:${port}`);
});
