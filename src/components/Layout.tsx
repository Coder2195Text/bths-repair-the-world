"use client";
import { FC, ReactNode } from "react";
import { signIn, useSession } from "next-auth/react";
import { BarLoader } from "react-spinners";
import { useAccount } from "./AccountContext";
import BirthdayPopup from "./BirthdayPopup";
import UserForm from "./UserForm";

interface Props {
  children?: ReactNode;
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

  if (data?.user.id.startsWith("auth0")) {
    signIn("auth0");
  }

  return (
    <div className="flex overflow-auto flex-wrap justify-center text-xl py-[79px] font-raleway">
      <main className="block w-full max-w-7xl text-center break-words rounded-xl px-[6vw] py-[3vw] max-w-screen 2xl:px-[79px] 2xl:py-[40px]">
        {accountStatus === "unregistered" && status === "authenticated" && (
          <UserForm mode="register" />
        )}
        {!children && (
          <div className="w-full h-screen flex items-center justify-center fixed flex-wrap flex-col top-0 left-0">
            <h1>Loading...</h1>
            <BarLoader
              color="#2563EB"
              className="my-3 max-w-full"
              width={600}
              height={10}
            />
          </div>
        )}
        {isBirthday && <BirthdayPopup />}
        {children}
      </main>
    </div>
  );
};

export default Layout;
