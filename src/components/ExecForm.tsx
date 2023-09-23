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
import { POSITION_LIST, POSITION_MAP } from "@/utils/constants";
import FormError from "./FormError";

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
      className="flex fixed inset-0 z-40 flex-row justify-center items-center w-screen h-screen text-black bg-black bg-opacity-50 py-8"
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          setOpen(false);
        }
      }}
    >
      <div className="overflow-auto max-w-5xl max-h-full text-center bg-blue-100 rounded-lg lg:p-8 p-[3.2vw]">
        <h5 className="font-bold">
          {mode === "post" ? "Posting" : "Editing"} Executive Profile
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
          initialValues={{
            position: mode === "edit" ? execData!.position : "",
            description: mode === "edit" ? execData!.description : "",
            selfieURL: mode === "edit" ? execData!.selfieURL : "",
          }}
          onSubmit={async (values) => {
            if (mode === "post") {
              const res = await fetch("/api/exec-desc/@me", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...values,
                }),
              });
              if (res.status === 200) {
                setOpen(false);
              }
            } else {
              const editted = Object.fromEntries(
                Object.keys(values)
                  .filter(
                    (key) =>
                      values[key as keyof typeof values]?.valueOf() !==
                      execData![key as keyof typeof values]?.valueOf()
                  )
                  .map((key) => [key, values[key as keyof typeof values]])
              );

              if (Object.keys(editted).length === 0) {
                setOpen(false);
                return;
              }

              const res = await fetch(`/api/exec-desc/@me`, {
                method: "PATCH",
                body: JSON.stringify({
                  ...editted,
                }),
              });

              if (res.status === 200) {
                setOpen(false);
                setExecData?.((await res.json()) as ExecDetails);
              }
            }
          }}
          validate={(values) => {
            const errors: any = {};

            if (!values.position) {
              errors.position = "Executive position is required.";
            }

            if (!values.description) {
              errors.description = "Executive description is required.";
            }

            if (values.description.length > 5000) {
              errors.description = "Executive description is too long.";
            }

            if (!values.selfieURL) {
              errors.selfieURL = "Selfie is required.";
            }

            return errors;
          }}
        >
          {({ isSubmitting, values, setFieldValue, errors, setFieldError }) => (
            <Form autoComplete="off">
              <label htmlFor="position">Executive Position: </label>
              <Field id="position" name="position" as="select">
                <option value="">Select a position</option>
                {POSITION_LIST.map((position) => (
                  <option value={position}>{POSITION_MAP[position]}</option>
                ))}
              </Field>
              <br />
              <FormError name="position" />
              <label htmlFor="description">
                Executive Description: ({5000 - values.description.length} chars
                left){" "}
              </label>
              <br />
              <Field
                id="description"
                name="description"
                as="textarea"
                maxLength={5000}
                className="w-full h-60 p-1 rounded-md"
                placeholder="Talk about yourself, using markdown."
              />
              <br />

              <FormError name="description" />
              {values.description && (
                <>
                  <label>Preview:</label>
                  <div className="w-full max-h-52 bg-gray-800 bg-opacity-20 overflow-auto p-1 rounded-md">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, reactGemoji]}
                      linkTarget="_blank"
                      components={{
                        h1: (props) => (
                          <h1 {...props} className="text-[35px] font-[700]" />
                        ),
                        h2: (props) => (
                          <h2 {...props} className="text-[32.5px] font-[650]" />
                        ),
                        h3: (props) => (
                          <h3 {...props} className="text-[30px] font-[600]" />
                        ),
                        h4: (props) => (
                          <h4 {...props} className="text-[27.5px] font-[550]" />
                        ),
                        h5: (props) => (
                          <h5 {...props} className="text-[25px] font-[500]" />
                        ),
                        h6: (props) => (
                          <h6 {...props} className="text-[22.5px] font-[450]" />
                        ),
                      }}
                    >
                      {values.description}
                    </ReactMarkdown>
                  </div>
                </>
              )}

              <label htmlFor="selfieURL">Selfie URL: </label>
              <input
                type="file"
                name="selfieURL"
                id="selfieURL"
                disabled={uploading}
                accept="image/*, .jpg,.png,.bmp,.gif,.webp,.jpeg"
                onChange={async (e) => {
                  let file;
                  if (!(file = e.target.files?.[0])) return;
                  setUploading(true);
                  const formData = new FormData();
                  formData.append("source", file);

                  const res = await fetch("/api/image-upload", {
                    method: "POST",
                    body: formData,
                  });
                  if (res.status !== 200) {
                    setFieldError(
                      "selfieURL",
                      "Error uploading image. You may have attached a bad file."
                    );
                    setUploading(false);
                    return;
                  }
                  const body = await res.json();
                  console.log(body);
                  setFieldValue("selfieURL", body.image.url);
                  e.target.value = "";
                  setUploading(false);
                }}
              />
              <div className="w-full flex justify-center relative items-center">
                {values.selfieURL ? (
                  <span className="relative">
                    <img
                      src={values.selfieURL}
                      className="max-w-full max-h-44 rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 p-0 bg-black bg-opacity-20 rounded-full"
                      onClick={() => {
                        setFieldValue("selfieURL", null);
                      }}
                    >
                      <BiXCircle className="w-10 h-10 text-white" />
                    </button>
                  </span>
                ) : (
                  "No selfie selected."
                )}
              </div>
              <FormError name="selfieURL" />

              <hr />
              <div>
                Due to caching, it may take up to 15 seconds for the execs to
                update.
              </div>

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
