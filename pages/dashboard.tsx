import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';

type Props = {};

const Dashboard = (props: Props) => {
  useEffect(() => {}, []);

  const UserDietInfoCard = () => {
    return (
      <div className="flex flex-col p-6 space-y-6 overflow-hidden rounded-lg shadow-md bg-gray-900 text-gray-100">
        <div className="flex space-x-4">
          <Image
            alt=""
            height={50}
            width={50}
            src="https://source.unsplash.com/100x100/?portrait"
            className="object-cover rounded-full shadow dark:bg-gray-500"
          />
          <div className="flex flex-col space-y-1">
            <Link
              rel="noopener noreferrer"
              href="/profile/"
              className="text-sm font-semibold"
            >
              Leroy Jenkins
            </Link>
            <span className="text-xs dark:text-gray-400">4 hours ago</span>
          </div>
        </div>
        <div>
          <h2 className="mb-1 text-xl font-semibold">
            Nam cu platonem posidonium sanctus debitis te
          </h2>
          <p className="text-sm dark:text-gray-400">
            Eu qualisque aliquando mel, id lorem detraxit nec, ad elit minimum
            pri. Illum ipsum detracto ne cum. Mundi nemore te ius, vim ad illud
            atqui apeirian...
          </p>
        </div>
      </div>
    );
  };
  return (
    <div className="flex items-center min-h-screen">
      <Sidebar />
      <div className="overflow-y-auto max-h-screen p-10">
        <UserDietInfoCard />
      </div>
    </div>
  );
};

export default Dashboard;
