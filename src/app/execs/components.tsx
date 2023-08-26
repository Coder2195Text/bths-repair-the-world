"use client";
import { useAccount } from "@/components/AccountContext";
import { POSITION_MAP } from "@/utils/maps";
import { FC, useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { ExecsDetails } from "./server-components";
import Image from "next/image";

export const ExecCard: FC<{ info: ExecsDetails[number] }> = ({
  info: {
    name,
    preferredName,
    gradYear,
    pronouns,
    email,
    execDetails: initialExecDetails,
  },
}) => {
  const { data } = useAccount();
  const [execDetails, setExecDetails] = useState(initialExecDetails);
  const [formOpen, setFormOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden">
      <div
        className="flex relative justify-center items-center p-2 w-full"
        style={{
          background: "linear-gradient(0deg, #757575 30%, #5ac8fa 0%)",
        }}
      >
        {execDetails ? (
          <Image
            width={100}
            height={100}
            className="mt-10 w-1/2 rounded-full"
            src={execDetails.selfieURL}
            alt=""
          />
        ) : (
          <BiUserCircle size={100} className="mt-10 w-1/2 rounded-full" />
        )}
      </div>
      <div key={email} className="bg-gray-600 p-4">
        <h3 className="text-2xl font-bold">
          {preferredName}
          {preferredName === name || ` (${name})`}
        </h3>
        <h6 className="text-lg">{pronouns.toLowerCase()}</h6>
        <p className="text-lg">Class of {gradYear}</p>
        {execDetails ? (
          <div>
            <h6 className="text-xl font-bold">
              {POSITION_MAP[execDetails.position]}
            </h6>
            <p>{execDetails.description}</p>
          </div>
        ) : (
          "The exec has not provided details about themselves."
        )}
      </div>
    </div>
  );
};
