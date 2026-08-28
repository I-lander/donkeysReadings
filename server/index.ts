import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import OpenAI from 'openai';
import { googleUserKey, verifyGoogleIdToken } from './auth';
import {
  consumeReading,
  creditAdReward,
  findReadingByQuestion,
  getQuota,
  getReadingHistory,
  mergeIdentity,
  saveReading,
  type ReadingRow,
} from './db';
import { verifySsvSignature } from './ssv';

interface DrawnCard {
  nameEn: string;
  nameFr: string;
}

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PRIVACY_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Privacy Policy - Les Lectures de l'Ane / Donkeys Readings</title>
<style>
  body { font-family: Georgia, serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #222; }
  h1, h2 { line-height: 1.3; }
  hr { margin: 2.5rem 0; }
</style>
</head>
<body>
<h1>Privacy Policy</h1>
<p><em>Les Lectures de l'Ane / Donkeys Readings - last updated: August 28, 2026</em></p>
<p>This application provides AI-generated tarot readings. It works without any user account; an optional Google sign-in lets you keep your reading history across devices.</p>
<h2>Data we process</h2>
<ul>
<li><strong>Device identifier</strong>: a random identifier generated on your device. It is sent with each request to enforce the daily free-reading quota and rewarded-ad credits, and to store your past readings. It is not linked to your identity.</li>
<li><strong>Reading content</strong>: the question you type and the drawn cards are sent to our server and to OpenAI (as a processor) to generate the reading, and are stored with your device identifier so that repeated questions return the same reading.</li>
<li><strong>Google sign-in (optional)</strong>: if you choose to sign in with Google, we receive your Google account identifier and email address. They are used only to attach your reading history and credits to your account so they follow you across devices.</li>
<li><strong>Advertising</strong>: rewarded ads are served by Google AdMob. In the European Economic Area, the United Kingdom and Switzerland, ads are shown only after you make a choice in the Google consent dialog. Google's use of advertising data is described in the <a href="https://policies.google.com/privacy">Google Privacy Policy</a>.</li>
</ul>
<h2>What we do not do</h2>
<ul>
<li>No account is required; without Google sign-in, no email or name is collected.</li>
<li>We do not sell your data.</li>
</ul>
<h2>Your choices</h2>
<p>You can withdraw or change your advertising consent at any time from the app. Uninstalling the app discards the device identifier stored on the device.</p>
<h2>Contact</h2>
<p>For any privacy question, open an issue on the <a href="https://github.com/I-lander/donkeysReadings">project repository</a>.</p>
<hr>
<h1>Politique de confidentialite</h1>
<p><em>Les Lectures de l'Ane / Donkeys Readings - derniere mise a jour : 28 aout 2026</em></p>
<p>Cette application fournit des lectures de tarot generees par IA. Elle fonctionne sans compte utilisateur ; une connexion Google optionnelle permet de conserver l'historique de vos lectures d'un appareil a l'autre.</p>
<h2>Donnees traitees</h2>
<ul>
<li><strong>Identifiant d'appareil</strong> : un identifiant aleatoire genere sur votre appareil. Il accompagne chaque requete pour appliquer le quota de lectures gratuites et les credits de publicite recompensee, et pour conserver vos lectures passees. Il n'est pas relie a votre identite.</li>
<li><strong>Contenu des lectures</strong> : la question saisie et les cartes tirees sont envoyees a notre serveur et a OpenAI (sous-traitant) pour generer la lecture, et sont conservees avec l'identifiant d'appareil afin qu'une question repetee renvoie la meme lecture.</li>
<li><strong>Connexion Google (optionnelle)</strong> : si vous choisissez de vous connecter avec Google, nous recevons votre identifiant de compte Google et votre adresse email. Ils servent uniquement a rattacher votre historique de lectures et vos credits a votre compte pour les retrouver sur vos autres appareils.</li>
<li><strong>Publicite</strong> : les publicites recompensees sont servies par Google AdMob. Dans l'Espace economique europeen, au Royaume-Uni et en Suisse, elles ne s'affichent qu'apres votre choix dans la boite de dialogue de consentement Google. L'utilisation des donnees publicitaires par Google est decrite dans les <a href="https://policies.google.com/privacy">Regles de confidentialite de Google</a>.</li>
</ul>
<h2>Ce que nous ne faisons pas</h2>
<ul>
<li>Aucun compte n'est requis ; sans connexion Google, aucun email ni nom n'est collecte.</li>
<li>Nous ne vendons pas vos donnees.</li>
</ul>
<h2>Vos choix</h2>
<p>Vous pouvez retirer ou modifier votre consentement publicitaire a tout moment depuis l'application. Desinstaller l'application supprime l'identifiant stocke sur l'appareil.</p>
<h2>Contact</h2>
<p>Pour toute question, ouvrez un ticket sur le <a href="https://github.com/I-lander/donkeysReadings">depot du projet</a>.</p>
</body>
</html>`;

function getDeviceId(req: express.Request): string | undefined {
  const deviceId = req.header('X-Device-Id');
  return deviceId && /^[\w-]{8,64}$/.test(deviceId) ? deviceId : undefined;
}

/**
 * Resolves the identity a request operates on: the Google account when a valid
 * Bearer ID token is sent, the device id otherwise. Writes the error response
 * and returns undefined when neither is usable.
 */
async function resolveIdentity(
  req: express.Request,
  res: express.Response
): Promise<string | undefined> {
  const authHeader = req.header('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const identity = await verifyGoogleIdToken(authHeader.slice('Bearer '.length));
    if (!identity) {
      res
        .status(401)
        .json({ error: { code: 'invalid_token', message: 'Invalid or expired Google token' } });
      return undefined;
    }
    return googleUserKey(identity.sub);
  }

  const deviceId = getDeviceId(req);
  if (!deviceId) {
    res.status(400).json({ error: { message: 'Missing X-Device-Id header' } });
    return undefined;
  }
  return deviceId;
}

// Public privacy policy page; its URL is required by the AdMob GDPR consent message.
app.get('/privacy', (_req, res) => {
  res.status(200).type('html').send(PRIVACY_HTML);
});

app.get('/api/quota', async (req, res) => {
  const identity = await resolveIdentity(req, res);
  if (!identity) return;
  res.json(getQuota(identity));
});

// Google sign-in: verifies the ID token, then migrates the device's history and
// credits to the Google account so they follow the user across devices.
app.post('/api/auth/google', async (req, res) => {
  const { idToken } = req.body as { idToken?: string };
  if (!idToken) {
    res.status(400).json({ error: { message: 'Missing idToken' } });
    return;
  }

  const identity = await verifyGoogleIdToken(idToken);
  if (!identity) {
    res
      .status(401)
      .json({ error: { code: 'invalid_token', message: 'Invalid or expired Google token' } });
    return;
  }

  const userId = googleUserKey(identity.sub);
  const deviceId = getDeviceId(req);
  if (deviceId) {
    mergeIdentity(deviceId, userId);
  }
  res.status(200).json({ userId, email: identity.email, quota: getQuota(userId) });
});

// AdMob rewarded ad Server-Side Verification callback.
// Configured in the AdMob console on the rewarded ad unit; user_id carries the
// identity the app passed to the ad (device id, or Google account key when signed in).
app.get('/api/admob/ssv', async (req, res) => {
  try {
    const rawQuery = req.originalUrl.split('?')[1] ?? '';
    const valid = await verifySsvSignature(rawQuery);
    if (!valid && process.env.ADMOB_SSV_SKIP_VERIFY !== 'true') {
      res.status(403).json({ error: { message: 'Invalid SSV signature' } });
      return;
    }

    const deviceId = String(req.query.user_id ?? '');
    const transactionId = String(req.query.transaction_id ?? '');
    if (!deviceId || !transactionId) {
      res.status(400).json({ error: { message: 'Missing user_id or transaction_id' } });
      return;
    }

    creditAdReward(deviceId, transactionId);
    res.status(200).send('OK');
  } catch (error) {
    console.error(`SSV error: ${(error as Error).message}`);
    res.status(500).send('Error');
  }
});

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

  const identity = await resolveIdentity(req, res);
  if (!identity) return;

  const language = lang === 'fr' ? 'fr' : 'en';

  // Same question already asked by this user: return the stored reading
  // (same answer, same cards), without an OpenAI call or quota consumption.
  const previous = findReadingByQuestion(identity, question, language);
  if (previous) {
    res.status(200).json({
      result: previous.result,
      cards: JSON.parse(previous.cards) as DrawnCard[],
      quota: getQuota(identity),
      cached: true,
    });
    return;
  }

  const quota = getQuota(identity);
  if (quota.freeRemaining <= 0 && quota.credits <= 0) {
    res.status(429).json({
      error: {
        code: 'quota_exhausted',
        message: 'No readings left today',
      },
    });
    return;
  }

  try {
    const history = getReadingHistory(identity);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: generatePrompt(question, cards, language, history) }],
      temperature: 0.8,
      max_tokens: 640,
    });
    consumeReading(identity);
    const result = completion.choices[0].message.content ?? '';
    saveReading(identity, question, language, JSON.stringify(cards), result);
    res.status(200).json({ result, cards, quota: getQuota(identity) });
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

function formatHistory(history: ReadingRow[], lang: string): string {
  if (history.length === 0) {
    return '';
  }

  const entries = history
    .map((reading) => {
      const cardNames = (JSON.parse(reading.cards) as DrawnCard[])
        .map((card) => (lang === 'fr' ? card.nameFr : card.nameEn))
        .join(', ');
      return lang === 'fr'
        ? `Question : ${reading.question}\nCartes : ${cardNames}\nLecture : ${reading.result}`
        : `Question: ${reading.question}\nCards: ${cardNames}\nReading: ${reading.result}`;
    })
    .join('\n---\n');

  return lang === 'fr'
    ? `Pour contexte, voici les lectures précédentes de cette personne (de la plus récente à la plus ancienne). Tenez-en compte si la nouvelle question s'y rapporte, sans les répéter :\n${entries}\n\n`
    : `For context, here are this person's previous readings (most recent first). Take them into account if the new question relates to them, without repeating them:\n${entries}\n\n`;
}

function generatePrompt(
  question: string,
  cards: DrawnCard[],
  lang: string,
  history: ReadingRow[]
): string {
  const context = formatHistory(history, lang);

  if (lang === 'fr') {
    return `${context}Veuillez fournir une lecture de tarot en utilisant les cartes suivantes avec des sauts de ligne appropriés entre chaque interprétation, et inclure une synthèse complète permettant de lier les 3 cartes ensemble : Question : ${question}\nCarte 1 : ${cards[0].nameFr}\nCarte 2 : ${cards[1].nameFr}\nCarte 3 : ${cards[2].nameFr}\nUtilisez uniquement ces cartes pour construire la lecture.`;
  }

  return `${context}Please provide a tarot reading using the following cards, with appropriate line breaks between each interpretation, and include a comprehensive synthesis that ties the 3 cards together: Question: ${question}\nCard 1: ${cards[0].nameEn}\nCard 2: ${cards[1].nameEn}\nCard 3: ${cards[2].nameEn}\nUse only these cards to construct the reading.`;
}

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`Donkeys Readings API listening on http://localhost:${port}`);
});
