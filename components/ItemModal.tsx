import { UIContext } from '@/context/UIContext';
import React from 'react';
import { BsX } from 'react-icons/bs';
import PieChart from './Charts/PieChart';
import NutrientsTable from './NutrientsTable';
import { useContext } from 'react';
import Image from 'next/image';

type Props = {};

const ItemModal = (props: Props) => {
  const { state, dispatch } = useContext(UIContext);
  const { openModal, modalContent } = state;
  const {
    image,
    name,
    calories,
    fat,
    proteins,
    nutrients,
    date,
    carbohydrates,
  } = modalContent!;

  const closeModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  if (!openModal) {
    return null;
  }

  return (
    <div className="fixed z-10 bg-black top-0 left-0 w-full h-full flex flex-col bg-opacity-70 items-center justify-center">
      <div className="p-10  rounded-2xl bg-gray-300 relative overflow-y-auto max-w-lg h-96">
        <button onClick={closeModal} className="absolute top-4 right-4">
          <BsX className="text-white text-3xl" />
        </button>
        <section className="space-y-4">
          <h1 className="text-4xl text-center text-semibold">Item Details</h1>
          <div className="relative w-full h-40">
            <Image src={image} fill alt="Item Image" className="object-cover" />
          </div>
          <div className="space-y-8">
            <h2 className="text-2xl text-center font-medium">
              Dish Name:
              <span className="font-light text-green-900">{name}</span>
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col justify-center items-center space-y-4">
                <PieChart lable="Calories" ci={calories * 100} ri={2500} />
                <h4>Calories : {calories * 100}Kcal</h4>
              </div>
              <div className="flex flex-col justify-center items-center space-y-4">
                <PieChart
                  lable="Carbohydrate"
                  ci={carbohydrates / 10000}
                  ri={325}
                />
                <h4>Carbohydrate : {carbohydrates / 10000}gm</h4>
              </div>
              <div className="flex flex-col justify-center items-center space-y-4">
                <PieChart lable="Fat" ci={fat} ri={8} />
                <h4>Fat : {fat / 10000}gm</h4>
              </div>
              <div className="flex flex-col justify-center items-center space-y-4">
                <PieChart lable="Proteins" ci={proteins / 10000} ri={8} />
                <h4>Proteins: {proteins / 10000}Kcal</h4>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-8">
            <h2 className="text-2xl font-medium">Other Nutrients:</h2>
            <NutrientsTable data={nutrients} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemModal;
