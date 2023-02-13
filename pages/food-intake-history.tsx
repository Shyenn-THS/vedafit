import ErrorMessage from '@/components/ErrorMessage';
import db from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState, useContext } from 'react';
import moment from 'moment';
import { UIContext } from '@/context/UIContext';
import { FoodItem } from '@/types/typings';
import { useRouter } from 'next/router';

type Props = {};

type TimelineDayProps = {
  date: string;
  intakes: FoodItem[];
};

const TimelineCard = ({ item }: { item: FoodItem }) => {
  const { image, name, calories, fat, proteins, nutrients, date, id } = item;
  const { dispatch } = useContext(UIContext);
  const router = useRouter();

  const handleModal = () => {
    dispatch({ type: 'OPEN_MODAL', payload: item });
  };
  return (
    <div
      onClick={() => {
        router.push(`/items/${id}`);
      }}
      className="flex flex-col cursor-pointer sm:relative items-center text-center justify-center max-w-sm before:dark:bg-green-400"
    >
      <div className="w-40 h-40 relative">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <h3 className="text-xl font-semibold tracking-wide pt-4">{name}</h3>
      <p className="">{moment(date).format('h:mm a')}</p>
    </div>
  );
};

const TimelineDay = (props: TimelineDayProps) => {
  const { date, intakes } = props;
  let totalCalories = 0;
  let totalCarbohydrates = 0;
  let totalFat = 0;
  let totalProteins = 0;

  intakes.map((intake) => {
    totalCalories += intake.calories;
    totalCarbohydrates += intake.carbohydrates;
    totalFat += intake.fat;
    totalProteins += intake.proteins;
  });

  return (
    <section className="dark:bg-gray-800 dark:text-gray-100">
      <div className="container max-w-5xl px-4 py-12 mx-auto">
        <div className="grid gap-4 mx-4 sm:grid-cols-12">
          <div className="col-span-12 sm:col-span-3">
            <div className="text-center sm:text-left">
              <h3 className="text-3xl font-semibold">
                {moment(date).format('dddd')}
              </h3>
              <span className="text-sm font-bold tracking-wider uppercase dark:text-gray-400">
                {moment(date).format('MMMM Do YYYY')}
              </span>
            </div>
            <div className="flex flex-col space-y-1 py-6 text-gray-1000 text-sm">
              <h4 className="">
                Total Calories: {Math.round(totalCalories / 10)} mg
              </h4>
              <h4 className="">
                Total Carbohydrates: {Math.round(totalCarbohydrates / 100000)}{' '}
                mg
              </h4>
              <h4 className="">Total Fat: {Math.round(totalFat / 10000)} mg</h4>
              <h4 className="">
                Total Proteins: {Math.round(totalProteins / 100000)} mg
              </h4>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 px-4 space-y-6 w-full">
            <div className="relative flex items-center space-x-8 px-4 overflow-x-scroll w-[800px]">
              {intakes.map((item, idx) => {
                return <TimelineCard item={item} key={idx} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FoodIntakeHistory = (props: Props) => {
  const { data: session } = useSession();
  const [foodIntakeData, setFoodIntakeData] = useState([]);

  useEffect(() => {
    if (!session) {
      return;
    }
    const getFoodIntakeData = async () => {
      const userRef = doc(db, 'users', session.user.email);
      const userSnap = await getDoc(userRef);
      const foodIntakeHistory = userSnap.data()?.foodIntakeHistory;

      if (foodIntakeHistory) {
        const foodIntakeDataArray = await Promise.all(
          foodIntakeHistory.map(async (foodIntakeRef) => {
            const foodIntakeSnap = await getDoc(foodIntakeRef);

            return { ...foodIntakeSnap.data(), id: foodIntakeSnap.id };
          })
        );

        const groups = foodIntakeDataArray.reduce((groups, item) => {
          const date = item.date.split('T')[0];
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(item);
          return groups;
        }, {});

        const groupArrays = Object.keys(groups).map((date) => {
          return {
            date,
            intakes: groups[date],
          };
        });

        setFoodIntakeData(groupArrays);
      }
    };
    getFoodIntakeData();
  }, [session]);

  if (!session) {
    return (
      <ErrorMessage
        action={{ name: 'Sign In', func: signIn }}
        message="Please Login to View Food Intake History"
      />
    );
  }

  return (
    <main>
      {foodIntakeData.map((data, idx) => {
        const { intakes, date } = data;
        return <TimelineDay date={date} intakes={intakes} key={idx} />;
      })}
    </main>
  );
};

export default FoodIntakeHistory;
