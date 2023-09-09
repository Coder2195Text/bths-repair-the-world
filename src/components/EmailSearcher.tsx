import { Button, Collapse } from "@material-tailwind/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Joi from "joi";
import { signOut } from "next-auth/react";
import { Dispatch, FC, MouseEvent, SetStateAction, useState } from "react";
import { BsExclamationOctagon } from "react-icons/bs";
import { useAccount } from "./AccountContext";
import { UserFull } from "@/types/user";
import Link from "next/link";
import { GRAD_YEARS } from "@/utils/constants";
import { Prisma } from "@prisma/client";

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const UserForm: FC<Props> = ({ setOpen }) => {
  return (
    <div
      className="flex fixed inset-0 z-40 flex-row justify-center items-center w-screen h-screen text-black bg-black bg-opacity-50"
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          setOpen(false);
        }
      }}
    >
      <div className="overflow-auto max-w-5xl max-h-full text-center bg-blue-100 rounded-lg lg:p-8 p-[3.2vw]">
        <Formik
          initialValues={{
            eventAlerts: true as boolean | undefined,
            gradYears: GRAD_YEARS,
            sgoSticker: undefined as boolean | undefined,
          }}
          onSubmit={async (values) => {
            if (values.eventAlerts === undefined) delete values.eventAlerts;
            if (values.sgoSticker === undefined) delete values.sgoSticker;

            const query: Prisma.UserWhereInput = {
              gradYear: {
                in: values.gradYears,
              },
              ...(values.eventAlerts && { eventAlerts: values.eventAlerts }),
              ...(values.sgoSticker && { sgoSticker: values.sgoSticker }),
            };

            const res = await fetch("/api/users", {
              method: "POST",
              body: JSON.stringify(query),
              headers: {
                "Content-Type": "application/json",
              },
            });
          }}
        ></Formik>
      </div>
    </div>
  );
};

export default UserForm;
