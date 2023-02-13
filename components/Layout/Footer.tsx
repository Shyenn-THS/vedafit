import { footer, socialLinks } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { SocialIcon } from 'react-social-icons';

type Props = {};

const Footer = (props: Props) => {
  const { others, quickLink } = footer;
  return (
    <div className="max-w-7xl mx-auto">
      <footer className="py-6 dark:bg-gray-800 dark:text-gray-50">
        <div className="container px-6 mx-auto space-y-6 divide-y divide-gray-400 md:space-y-12 divide-opacity-50">
          <div className="grid grid-cols-12">
            <div className="pb-6 col-span-full md:pb-0 md:col-span-6">
              <Link
                href="/"
                className="flex justify-center space-x-3 md:justify-start"
              >
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  className="w-1/3"
                  width={500}
                  height={300}
                />
              </Link>
            </div>
            <div className="col-span-6 text-center md:text-left md:col-span-3">
              <p className="pb-1 text-lg font-bold">Quick Links</p>
              <ul className="flex flex-col">
                {quickLink.map((link, idx) => {
                  const { name, href } = link;
                  return (
                    <Link
                      className="hover:dark:text-green-400"
                      key={idx}
                      href={href}
                    >
                      {name}
                    </Link>
                  );
                })}
              </ul>
            </div>
            <div className="col-span-6 text-center md:text-left md:col-span-3">
              <p className="pb-1 text-lg font-bold">Others</p>
              <ul className="flex flex-col">
                {others.map((link, idx) => {
                  const { name, href } = link;
                  return (
                    <Link
                      className="hover:dark:text-green-400"
                      key={idx}
                      href={href}
                    >
                      {name}
                    </Link>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="grid justify-center pt-6 lg:justify-between">
            <div className="flex flex-col self-center text-sm text-center md:block lg:col-start-1 md:space-x-6">
              <span>©{new Date().getFullYear()} All rights reserved</span>
              <a rel="noopener noreferrer" href="#">
                <span>Privacy policy</span>
              </a>
              <a rel="noopener noreferrer" href="#">
                <span>Terms of service</span>
              </a>
            </div>
            <div className="flex justify-center pt-4 space-x-4 lg:pt-0 lg:col-end-13">
              {socialLinks.map((social, idx) => {
                return (
                  <SocialIcon
                    fgColor="white"
                    bgColor="gray"
                    src={social}
                    key={idx}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
