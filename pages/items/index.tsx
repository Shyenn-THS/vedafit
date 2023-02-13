import db from '@/lib/firebase';
import { Dish } from '@/types/typings';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ExtendedDish extends Dish {
  id: string;
}

type Props = {
  items: ExtendedDish[];
};

const Items = (props: Props) => {
  const { items } = props;

  return (
    <div className="grid grid-cols-4">
      {items?.map((item) => {
        const { name, id, calories, carbohydrates, fat, nutrients, proteins } =
          item;
        return (
          <Link href={`/items/${id}`} key={id} rel="noreffer" target="_blank">
            <div className="max-w-xs p-6 rounded-md shadow-md dark:bg-gray-900 dark:text-gray-50">
              <div className="relative h-72 w-full rounded-md dark:bg-gray-500">
                <Image
                  src={`https://source.unsplash.com/random/1080x1080/?${name}`}
                  alt={name}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="mt-6 mb-2 text-2xl">{name}</div>
              {/* <p className="dark:text-gray-100">
                Mauris et lorem at elit tristique dignissim et ullamcorper elit.
                In sed feugiat mi. Etiam ut lacinia dui.
              </p> */}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export const getServerSideProps = async () => {
  const itemsCollection = collection(db, 'food');
  const itemsQuery = query(itemsCollection, orderBy('name', 'asc'));
  const itemsSnap = await getDocs(itemsQuery);
  let items: ExtendedDish[] = [];
  itemsSnap.forEach((doc) => {
    const data = doc.data();
    items.push({ ...data, id: doc.id });
  });

  return {
    props: {
      items,
    },
  };
};

export default Items;
