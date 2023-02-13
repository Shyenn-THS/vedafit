import { navLinks } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import jsCookie from 'js-cookie';
import { UIContext } from '@/context/UIContext';
import { BsFillSunFill, BsMoonFill } from 'react-icons/bs';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { FaBars } from 'react-icons/fa';

type Props = {};

const Navbar = (props: Props) => {
  const { state, dispatch } = useContext(UIContext);
  const { darkMode, openDrawer } = state;
  const { data: session } = useSession();
  const router = useRouter();

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    jsCookie.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      setDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDark(false);
    }
    return () => {};
  }, [darkMode]);

  const [selected, setSelected] = useState(0);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="p-4 dark:bg-gray-800 dark:text-gray-100">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="">
            <Image
              src="/logo.svg"
              alt="Logo"
              className=""
              width={150}
              height={150}
            />
          </Link>
          <ul className="hidden space-x-6 whitespace-nowrap lg:flex">
            {navLinks.map((link, idx) => {
              const { name, href } = link;
              return (
                <button
                  className={classNames(
                    selected === idx
                      ? 'text-green-800 underline underline-offset-2'
                      : 'text-white'
                  )}
                  onClick={() => {
                    setSelected(idx);
                    router.push(`/${href}`);
                  }}
                  key={idx}
                >
                  {name}
                </button>
              );
            })}
          </ul>
          <div className="items-center lg:space-x-6 hidden lg:flex">
            {dark ? (
              <BsFillSunFill
                className="text-lg"
                onClick={darkModeChangeHandler}
              />
            ) : (
              <BsMoonFill className="text-lg" onClick={darkModeChangeHandler} />
            )}

            {session ? (
              <div className="avatar avatar-ring avatar-sm">
                <div className="dropdown-container">
                  <div className="dropdown">
                    <div
                      className="btn relative btn-ghost cursor-pointer hover:bg-inherit"
                      tabIndex={0}
                    >
                      <Image
                        fill
                        className="object-cover"
                        src={session?.user?.image!}
                        alt={session?.user?.name!}
                      />
                    </div>
                    <div className="dropdown-menu dark:bg-gray-1000 dropdown-menu-bottom-left">
                      <Link
                        href={`/profile/${session?.user?.username!}`}
                        className="dropdown-item text-sm dark:hover:bg-gray-900"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/account-settings"
                        tabIndex={-1}
                        className="dropdown-item text-sm dark:hover:bg-gray-900"
                      >
                        Account settings
                      </Link>
                      <button
                        onClick={() => signOut()}
                        tabIndex={-1}
                        className="dropdown-item text-sm dark:hover:bg-gray-900"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="btn-rounded btn bg-green-800"
              >
                Sign In
              </button>
            )}

            {session && session?.user.role === 'dietician' ? (
              <Link
                href="/dashboard"
                className="btn-rounded btn bg-gradient-to-t from-gray-700 to-gray-600"
              >
                For Dietician
              </Link>
            ) : null}
          </div>
          <button className="p-4 lg:hidden">
            <FaBars />
          </button>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
