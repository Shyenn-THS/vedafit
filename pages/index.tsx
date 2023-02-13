import Head from 'next/head';
import { Inter } from '@next/font/google';
import Hero from '@/components/Hero';
import foods from '../data/foods.json';
import nutrients from '../data/foods.json';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore';
import db from '@/lib/firebase';
import * as fs from 'fs/promises';
import { classes } from '@/data/items';
import { titleCase } from '@/lib/utilityFunctions';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  // const upload = () => {
  //   nutrients.forEach(async (nutrient) => {
  //     const docRef = await addDoc(collection(db, 'nutrient'), nutrient);
  //     console.log(docRef);
  //   });
  // };

  // const update = async () => {
  //   classes.forEach((value, idx) => {
  //     const title = titleCase(value.replaceAll('_', ' '));
  //     classes[idx] = title;
  //   });

  //   const itemsCollection = collection(db, 'food');
  //   const itemsQuery = query(itemsCollection);
  //   const itemsSnap = await getDocs(itemsQuery);
  //   let items = [];
  //   itemsSnap.forEach((doc) => {
  //     items.push(doc.id);
  //   });

  //   for (let index = 0; index < classes.length; index++) {
  //     const updateRef = doc(db, 'food', items[index]);
  //     const tx = await updateDoc(updateRef, { name: classes[index] });
  //     console.log(tx);
  //   }
  // };

  return (
    <>
      <Head>
        <title>VedaFit | Keep your diet health.</title>
        <meta
          name="description"
          content="Personalized diet recomendation platform"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-7xl mx-auto">
        {/* <button onClick={update}>Upload</button> */}
        <Hero />
      </main>
    </>
  );
}
