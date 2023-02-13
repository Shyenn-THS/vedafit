import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {};

const Hero = (props: Props) => {
  return (
    <section className="dark:bg-gray-800 dark:text-gray-100">
      <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
        <div className="flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
          <div className="object-cover relative z-30 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
            <Image
              src="/assets/svg/Hero.svg"
              alt="Hero Vector"
              width={500}
              height={500}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
          <h1 className="text-5xl font-bold leading-none sm:text-6xl">
            Get insights of what you <span className="text-green-900">Eat</span>
          </h1>
          <p className="mt-6 mb-8 text-lg sm:mb-12">
            Add item what you eat daily and analyze them.
            <br className="hidden md:inline lg:hidden" />
            Ask doctor for recomending about your health
          </p>
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            <Link
              href="/add-food"
              className="px-8 py-3 text-lg font-semibold rounded dark:bg-green-400 dark:text-gray-900"
            >
              Add Food
            </Link>
            <Link
              href="/ask"
              className="px-8 py-3 text-lg font-semibold border rounded dark:border-gray-100"
            >
              Ask Expert
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
