import ErrorMessage from '@/components/ErrorMessage';
import { UserDetails } from '@/types/typings';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { uploadToCloudinary } from '@/lib/uploadImage';
import { toast } from 'react-hot-toast';

type Props = {};

const Profile = (props: Props) => {
  const hiddenFileInput = useRef();
  const [preview, setPreview] = useState<string | undefined>();
  const [image, setImage] = useState<File>();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserDetails>();

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImage(file);
    }
  }

  useEffect(() => {
    setValue('fname', session?.user.fname);
    setValue('lname', session?.user.lname);
    setValue('bio', session?.user.bio);
    setValue('gender', session?.user.gender);
    setValue('age', session?.user.age);
    setValue('email', session?.user.email);
    setPreview(session?.user.image);
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
    const dataToSend = {
      ...data,
      image: image ? await uploadToCloudinary(image!) : session?.user?.image,
      email: session?.user?.email,
      username: session?.user?.username,
    };

    try {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.status === 200) {
        toast.success('Profile Updated Sucessfully!');
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
      <section className="p-6 dark:bg-gray-800 dark:text-gray-50">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="container flex flex-col mx-auto space-y-12 ng-untouched ng-pristine ng-valid"
        >
          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
            <div className="space-y-2 col-span-full lg:col-span-1">
              <p className="font-medium">Personal Inormation</p>
              <p className="text-xs">
                Add or update your personal information.
              </p>
            </div>
            <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="firstname" className="text-sm">
                  First name
                </label>
                <input
                  {...register('fname')}
                  type="text"
                  placeholder="First name"
                  className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-green-400 dark:border-gray-700 dark:text-gray-900 px-4 py-2"
                />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="lastname" className="text-sm">
                  Last name
                </label>
                <input
                  {...register('lname')}
                  type="text"
                  placeholder="Last name"
                  className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-green-400 dark:border-gray-700 dark:text-gray-900 px-4 py-2"
                />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
                <input
                  {...register('email')}
                  disabled
                  placeholder="Email"
                  className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-green-400 dark:border-gray-700 dark:text-gray-900 px-4 py-2"
                />
              </div>
              {/* <div className="col-span-full sm:col-span-2">
                <label htmlFor="city" className="text-sm">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder=""
                  className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-green-400 dark:border-gray-700 dark:text-gray-900 px-4 py-2"
                />
              </div>
              <div className="col-span-full sm:col-span-2">
                <label htmlFor="state" className="text-sm">
                  State / Province
                </label>
                <input
                  id="state"
                  type="text"
                  placeholder=""
                  className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-green-400 dark:border-gray-700 dark:text-gray-900 px-4 py-2"
                />
              </div>
              <div className="col-span-full sm:col-span-2">
                <label htmlFor="zip" className="text-sm">
                  ZIP / Postal
                </label>
                <input
                  id="zip"
                  type="text"
                  placeholder=""
                  className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-green-400 dark:border-gray-700 dark:text-gray-900 px-4 py-2"
                />
              </div> */}
            </div>
          </fieldset>
          <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">
            <div className="space-y-2 col-span-full lg:col-span-1">
              <p className="font-medium">Profile</p>
              <p className="text-xs">Adipisci fuga autem eum!</p>
            </div>
            <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="username" className="text-sm">
                  Age
                </label>
                <input
                  {...register('age')}
                  type="number"
                  min={6}
                  max={100}
                  placeholder="Username"
                  className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-green-400 dark:border-gray-700 dark:text-gray-900 px-4 py-2"
                />
              </div>
              <div className="col-span-full sm:col-span-3">
                <label htmlFor="website" className="text-sm">
                  Gender
                </label>
                <select
                  {...register('gender')}
                  className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-green-400 dark:border-gray-700 dark:text-gray-900 px-4 py-2"
                >
                  <option value="Not Selected" disabled selected>
                    Not Selected
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="col-span-full">
                <label htmlFor="bio" className="text-sm">
                  Bio
                </label>
                <textarea
                  {...register('bio')}
                  placeholder="Something About You...."
                  className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-green-400 dark:border-gray-700 dark:text-gray-900 px-4 py-2"
                ></textarea>
              </div>
              <div className="col-span-full">
                <label htmlFor="bio" className="text-sm">
                  Photo
                </label>
                <div className="flex items-center space-x-2">
                  <Image
                    src={preview ? preview : '/assets/png/profile.png'}
                    alt=""
                    className="rounded-full dark:bg-gray-500 object-cover"
                    height={40}
                    width={40}
                  />
                  <input
                    ref={hiddenFileInput}
                    onChange={handleChange}
                    type="file"
                    accept="jpg, png, jpeg"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="px-4 py-2 border rounded-md dark:border-gray-100"
                    onClick={handleClick}
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </fieldset>
          <button
            type="submit"
            className="px-8 py-3 font-semibold rounded dark:bg-gray-100 dark:text-gray-800 w-fit mx-auto"
          >
            Submit
          </button>
        </form>
      </section>
    </main>
  );
};

export default Profile;
