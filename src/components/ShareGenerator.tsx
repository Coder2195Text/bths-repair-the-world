"use client";
import { useSession } from "next-auth/react";
import { Dispatch, FC, MouseEvent, SetStateAction } from "react";
import CopyTextarea from "./CopyTextarea";
import { useAccount } from "./AccountContext";

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ShareGenerator: FC<Props> = ({ setOpen }) => {
  const { data } = useSession();
  const allowed = Boolean(data?.user?.email);
  const { data: accountData } = useAccount();
  console.log(data?.user.email);
  return (
    <div
      className="flex fixed inset-0 z-40 flex-row justify-center items-center w-screen h-screen text-black bg-black bg-opacity-50 py-8"
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          setOpen(false);
        }
      }}
    >
      <div className="overflow-auto max-w-5xl max-h-full text-center bg-blue-100 rounded-lg lg:p-8 p-[3.2vw]">
        <h5>
          {allowed
            ? "Sharing Club Invite"
            : "Please Sign In to Share Club Invite"}
        </h5>
        <h6>
          <a
            onClick={() => {
              setOpen(false);
            }}
            className="ml-2"
          >
            Exit
          </a>
        </h6>
        <br />
        Here is your invite link.
        <br />
        {allowed && (
          <>
            <CopyTextarea lines={1}>
              https://bths-repair.org/invite?ref={data?.user.email}
            </CopyTextarea>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareGenerator;
