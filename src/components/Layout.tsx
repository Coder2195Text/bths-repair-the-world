"use client";

import { FC, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BarLoader } from "react-spinners";
import Navbar from "./Navbar";
import { useAccount } from "./AccountContext";
import BirthdayPopup from "./BirthdayPopup";
import UserForm from "./UserForm";
import io from "socket.io-client";
import VerifyEmail from "./VerifyEmail";

interface Props {
  children: ReactNode;
}

let socket;

const Layout: FC<Props> = ({ children }) => {
  const { status, data } = useSession();
  const { status: accountStatus, data: accountData } = useAccount();
  const today = new Date();
  const birthday = accountData?.birthday
    ? new Date(accountData.birthday)
    : undefined;

  const isBirthday =
    birthday?.getUTCDate() === today.getDate() &&
    birthday?.getUTCMonth() === today.getMonth();
  console.log(accountStatus);

  if (status === "loading" || accountStatus === "pending" || !children) {
    return (
      <div className="flex fixed top-0 left-0 flex-col justify-center items-center p-10 w-screen h-screen">
        <h1>Loading...</h1>
        <BarLoader color="#ffffff" width={600} className="mt-12" />
      </div>
    );
  }

  if (data?.user && !data.user.email_verified) return <VerifyEmail />;

  return (
    <div className="flex flex-wrap justify-center text-xl py-[79px] font-tyros">
      <main className="block w-full max-w-7xl text-center break-words rounded-xl px-[6vw] py-[3vw] max-w-screen 2xl:px-[79px] 2xl:py-[40px]">
        {accountStatus === "unregistered" && status === "authenticated" && (
          <UserForm mode="register" />
        )}
        {isBirthday && <BirthdayPopup />}
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default Layout;
