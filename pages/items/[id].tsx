import PieChart from '@/components/Charts/PieChart';
import NutrientsTable from '@/components/NutrientsTable';
import db from '@/lib/firebase';
import { Dish } from '@/types/typings';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import Image from 'next/image';
import React from 'react';

type Props = {
  item: Dish;
};

const ItemPage = (props: Props) => {
  const { item } = props;
  const { calories, carbohydrates, fat, name, nutrients, proteins } = item;
  return (
    <section className="p-10 space-y-4">
      <div className="w-full h-96 relative">
        <Image
          src={`https://source.unsplash.com/random/1080x1080/?${name}`}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6 space-y-8">
        <h2 className="text-2xl font-medium">
          Dish Name: <span className="font-light text-green-900">{name}</span>
        </h2>
        <div className="grid grid-cols-4 gap-x-6 gap-y-4">
          <div className="flex flex-col justify-center items-center space-y-4">
            <PieChart lable="Calories" ci={calories} ri={8} />
            <h4>Calories</h4>
          </div>
          <div className="flex flex-col justify-center items-center space-y-4">
            <PieChart lable="Carbohydrate" ci={carbohydrates} ri={8} />
            <h4>Carbohydrate</h4>
          </div>
          <div className="flex flex-col justify-center items-center space-y-4">
            <PieChart lable="Fat" ci={fat} ri={8} />
            <h4>Fat</h4>
          </div>
          <div className="flex flex-col justify-center items-center space-y-4">
            <PieChart lable="Proteins" ci={proteins} ri={8} />
            <h4>Proteins</h4>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-8">
        <h2 className="text-2xl font-medium">Other Nutrients:</h2>
        <NutrientsTable data={nutrients} />
      </div>
    </section>
  );
};

export const getStaticPaths = async () => {
  const itemsCollection = collection(db, 'food');
  const itemsQuery = query(itemsCollection);
  const itemssSnap = await getDocs(itemsQuery);
  let items: string[] = [];
  itemssSnap.forEach((doc) => {
    items.push(doc.id);
  });
  const paths = items.map((id) => ({
    params: {
      id,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params }) => {
  const id = params?.id;
  const docRef = doc(db, 'food', id);
  const docSnap = await getDoc(docRef);
  const item = docSnap.data();

  if (!docSnap.exists()) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      item,
    },
    revalidate: 60, //updates old cache after 60sec
  };
};

export default ItemPage;
