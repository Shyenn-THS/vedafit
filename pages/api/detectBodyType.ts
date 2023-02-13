// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/firebase';
import { setDoc, doc, updateDoc } from 'firebase/firestore';

type Data = {
  body_frame: string;
  body_build_and_musculature: string;
  complexion: string;
  skin: string;
  teeth: string;
  nails: string;
  eyes: string;
  lips: string;
  hair: string;
  weight: string;
  movements_and_physical_activities: string;
  tolerance_for_seasonal_weather: string;
  disease_resistant_and_healing_capacity: string;
  food_habits: string;
  appetite: string;
  digestion: string;
  bowel_movements: string;
  liking_towards_various_taste: string;
  communication_speech: string;
  capabilities_activity_level: string;
  memory_intellectual_level: string;
  ageing: string;
  emotions: string;
  sleep: string;
  personality_strengths: string;
  featured_traits: string;
  email: string;
};

interface ExtendedNextApiRequest extends NextApiRequest {
  body: Data;
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  const { testData, user } = req.body;

  const arr = Object.values(testData);
  let vata = 0;
  let pitta = 0;
  let kapha = 0;

  arr.forEach((val) => {
    switch (val) {
      case 'v':
        vata++;
        break;
      case 'p':
        pitta++;
        break;
      case 'k':
        kapha++;
        break;

      default:
        break;
    }
  });

  try {
    await setDoc(doc(db, 'users_characteristics', user.email), req.body);
    await updateDoc(doc(db, 'users', user.email), {
      vata: vata,
      pitta: pitta,
      kapha: kapha,
    });
    res.status(200).send({ vata, pitta, kapha });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: 'Sorry, Some error occured at our side!',
    });
  }
}
