"use client";
import { FC, ReactNode } from "react";
import { signIn, useSession } from "next-auth/react";
import { BarLoader } from "react-spinners";
import { useAccount } from "./AccountContext";
import UserForm from "./UserForm";

interface Props {
  children?: ReactNode;
}

let socket;

const Layout: FC<Props> = ({ children }) => {
  const { status, data } = useSession();
  const { status: accountStatus, data: accountData } = useAccount();

  if (data?.user.id.startsWith("auth0")) {
    signIn("auth0");
  }

  return (
    <main className="block w-full max-w-7xl text-center break-words rounded-xl px-[6vw] max-w-screen 2xl:px-[79px] mx-auto">
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
      {children}
    </main>
  );
};

export default Layout;
