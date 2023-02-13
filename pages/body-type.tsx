import ErrorMessage from '@/components/ErrorMessage';
import Stats from '@/components/Stats';
import { charecteristics } from '@/data/charecteristics';
import { UserDetails } from '@/types/typings';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type Props = {};

const BodyType = (props: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserDetails>();

  const { data: session } = useSession();
  const [userType, setUserType] = useState({
    vata: 20,
    pitta: 2,
    kapha: 4,
  });

  useEffect(() => {
    if (!session) return;
    const { vata, pitta, kapha } = session?.user;
    setUserType({
      vata,
      pitta,
      kapha,
    });
  }, [session]);

  if (!session) {
    return (
      <ErrorMessage
        message="Please Login To Continue"
        action={{ name: 'Login', func: signIn }}
      />
    );
  }

  const onSubmit = async (data: UserDetails) => {
    try {
      const response = await fetch('/api/detectBodyType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testData: data, user: session?.user }),
      });

      if (response.status === 200) {
        toast.success('Updated Sucessfully!');
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <section className="p-6 dark:bg-gray-800 rounded-xl">
        <Stats
          vata={userType.vata}
          pitta={userType.pitta}
          kapha={userType.kapha}
        />
      </section>

      <section className="p-6 dark:bg-gray-800">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="container flex flex-col mx-auto space-y-12 ng-untouched ng-pristine ng-valid"
        >
          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
            <div className="space-y-2 col-span-full lg:col-span-1">
              <p className="font-medium">Personal Charecteristics</p>
              <p className="text-xs">
                Fill your personal charecteristics that will help us identify
                your ayurvedic body type.
              </p>
            </div>
            <form className="grid grid-cols-2 gap-4 col-span-full lg:col-span-3">
              {Object.keys(charecteristics).map((key, idx) => {
                return (
                  <div
                    key={idx}
                    className="col-span-full flex items-center justify-between"
                  >
                    <label htmlFor="firstname" className="text-sm space-x-2">
                      {key.split('_').map((val, idx) => {
                        return <span key={idx}>{val.toUpperCase()}</span>;
                      })}
                    </label>
                    <select
                      className="w-80 px-4 py-2"
                      key={idx}
                      {...register(key)}
                    >
                      {charecteristics[key].map((opt, idx) => {
                        return (
                          <option
                            className="space-x-2 uppercase"
                            key={idx}
                            value={idx === 0 ? 'v' : idx === 1 ? 'p' : 'k'}
                          >
                            {opt.replaceAll('_', ' ')}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
              })}
            </form>
          </fieldset>

          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-tr from-gray-500 to-gray-200 shadow-lg font-semibold rounded dark:bg-gray-100 dark:text-gray-800 w-fit mx-auto"
          >
            Submit
          </button>
        </form>
      </section>
    </main>
  );
};

export default BodyType;
