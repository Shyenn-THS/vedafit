import { ReactNode } from 'react';
import Footer from './Layout/Footer';
import Navbar from './Layout/Navbar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto bg-gray-600">{children}</main>
      <Footer />
    </>
  );
}
