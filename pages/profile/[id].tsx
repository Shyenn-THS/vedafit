import React from 'react';
import { UserDetails } from '../../types/typings';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import db from '../../lib/firebase';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Stats from '@/components/Stats';
import Image from 'next/image';
// import SessionCard from '../../components/SessionCard';
// import { SocialIcon } from 'react-social-icons';

type Props = {
  userData: UserDetails;
};

const UserPage = (props: Props) => {
  const { userData } = props;

  const {
    fname,
    lname,
    image,
    // instagram,
    // twitter,
    // linkedin,
    age,
    gender,
    bio,
  } = userData;

  return (
    <main className="dark:bg-gray-1000 py-20 w-full space-y-8">
      <div className="p-6 sm:p-12 max-w-7xl mx-auto dark:bg-gray-900 dark:text-gray-100 space-y-10">
        <div className="flex justify-between w-full">
          <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row">
            <Image
              src={image}
              alt={fname + ' ' + lname}
              className="self-center flex-shrink-0 w-24 h-24 border rounded-full md:justify-self-start dark:bg-gray-500 dark:border-gray-700 object-cover"
              width={1080}
              height={1080}
            />
            <div className="flex flex-col">
              <h4 className="text-lg font-semibold text-center md:text-left">
                {fname + ' ' + lname}
              </h4>
              <h5 className="text-md font-medium text-center md:text-left">
                {}
              </h5>
              <p className="dark:text-gray-600 text-sm">{bio}</p>
            </div>
          </div>
          {/* <Stats
            ownSessionsNumber={ownSessions.length}
            attendedSessionsNumber={attendedSessions.length}
          /> */}
        </div>
        <div className="flex space-x-2 w-fit mx-auto">
          {/* <SocialIcon bgColor="#909090" fgColor="#101010" url={instagram} /> */}
          {/* <SocialIcon bgColor="#909090" fgColor="#101010" url={twitter} /> */}
          {/* <SocialIcon bgColor="#909090" fgColor="#101010" url={linkedin} /> */}
        </div>
      </div>

      <div className="dark:bg-gray-800 max-w-7xl mx-auto p-6 sm:p-12 ">
        <h1 className="text-3xl font-medium py-4 text-gray-50 text-center">
          Own Sessions
        </h1>
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // Fetch data from external API
  try {
    let userData: UserDetails | undefined = undefined;
    const userQuery = query(
      collection(db, 'users'),
      where('username', '==', params!.id as string)
    );
    const userSnap = await getDocs(userQuery);
    userSnap.forEach((doc) => {
      userData = doc.data() as UserDetails;
    });

    // Pass data to the page via props
    return { props: { userData: JSON.parse(JSON.stringify(userData)) } };
  } catch (error: any) {
    console.error(error.message);
    return { props: { ...error } };
  }
};

export default UserPage;
