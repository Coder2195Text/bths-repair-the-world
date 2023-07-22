"use client";

import { FC, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { BarLoader } from "react-spinners";
import Navbar from "./Navbar";
import { useAccount } from "./AccountContext";
import BirthdayPopup from "./BirthdayPopup";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const { status } = useSession();
  const { status: accountStatus, data } = useAccount();
  const today = new Date();
  const birthday = data?.birthday ? new Date(data.birthday) : undefined;
  const isBirthday =
    birthday?.getDate() === today.getDate() &&
    birthday.getMonth() === today.getMonth();

  if (status === "loading" || accountStatus === "pending" || !children) {
    return (
      <div className="flex fixed top-0 left-0 flex-col justify-center items-center p-10 w-screen h-screen">
        <h1 className="vscale">Loading...</h1>
        <BarLoader color="#ffffff" width={600} className="mt-12" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center py-14 text-xl font-tyros">
      <main className="block w-full max-w-7xl text-center break-words rounded-xl px-[6vw] py-[6vw] max-w-screen 2xl:px-[79px] 2xl:py-[79px]">
        {isBirthday && <BirthdayPopup />}
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default Layout;
