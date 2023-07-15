"use client";

import { FC, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { BarLoader } from "react-spinners";
import Navbar from "./Navbar";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const { status } = useSession();

  return (
    <div className="flex flex-wrap justify-center py-24 text-xl font-tyros">
      {status !== "loading" && children ? (
        <main className="block max-w-7xl text-center break-words bg-white bg-opacity-10 rounded-xl px-[6vw] py-[8vw] max-w-screen">
          <Navbar />
          {children}
        </main>
      ) : (
        <div className="flex fixed top-0 left-0 flex-col justify-center items-center p-10 w-screen h-screen">
          <h1>Loading...</h1>
          <BarLoader color="#ffffff" width={600} className="mt-12" />
        </div>
      )}
    </div>
  );
};

export default Layout;
