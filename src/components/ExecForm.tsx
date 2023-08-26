import { Button, Collapse } from "@material-tailwind/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Joi from "joi";
import { signOut } from "next-auth/react";
import { Dispatch, FC, MouseEvent, SetStateAction, useState } from "react";
import { BsExclamationOctagon } from "react-icons/bs";
import { useAccount } from "./AccountContext";
import { UserFull } from "@/types/user";
import Link from "next/link";
import { Event, ExecDetails } from "@prisma/client";
import { EventParsed } from "@/types/event";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import reactGemoji from "remark-gemoji";
import { BiX, BiXCircle } from "react-icons/bi";
import DateTimePicker from "react-datetime-picker";
import { useRouter } from "next/navigation";

const Error: FC<{ name: string }> = (props) => {
  return (
    <ErrorMessage name={props.name}>
      {(msg: string) => (
        <div className="flex justify-center items-center text-red-500">
          <BsExclamationOctagon size={24} className="mr-2" /> {msg}
        </div>
      )}
    </ErrorMessage>
  );
};

type Props = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  mode: "post" | "edit";
  execData?: ExecDetails;
  setExecData?: Dispatch<SetStateAction<ExecDetails>>;
};

const ExecForm: FC<Props> = ({ mode, setOpen, execData, setExecData }) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
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
        <h5 className="font-bold">
          {mode === "post" ? "Posting Event" : "Editing Event"}
        </h5>
        <h6>
          <a
            onClick={() => {
              setOpen(false);
            }}
            className="ml-2"
          >
            Discard Changes And Exit
          </a>
        </h6>
        <hr />
        <Formik
          initialValues={{}}
          onSubmit={async (values) => {}}
          validate={(values) => {}}
        >
          {({ isSubmitting, values, setFieldValue, errors, setFieldError }) => (
            <Form autoComplete="off">
              <Button
                type="submit"
                disabled={isSubmitting}
                ripple
                className="text-xl font-raleway"
                color="light-blue"
              >
                {isSubmitting ? "Submitting" : "Submit"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ExecForm;
