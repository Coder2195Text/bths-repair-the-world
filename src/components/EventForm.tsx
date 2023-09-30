import { Button } from "@material-tailwind/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Dispatch, FC, MouseEvent, SetStateAction, useState } from "react";
import { BsExclamationOctagon } from "react-icons/bs";
import { Event } from "@prisma/client";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import reactGemoji from "remark-gemoji";
import { BiXCircle } from "react-icons/bi";
import DateTimePicker from "react-datetime-picker";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
  eventData?: Event;
  setEventData?: Dispatch<SetStateAction<Event>>;
};

const EventForm: FC<Props> = ({ mode, setOpen, eventData, setEventData }) => {
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
          initialValues={{
            name: mode == "edit" ? eventData!.name : "",
            description: mode == "edit" ? eventData!.description : "",
            maxHours: mode == "edit" ? eventData!.maxHours : 0,
            maxPoints: mode == "edit" ? eventData!.maxPoints : 0,
            eventTime:
              mode == "edit"
                ? eventData!.eventTime
                : (undefined as Date | undefined),
            address: mode == "edit" ? eventData!.address : "",
            imageURL:
              mode == "edit"
                ? eventData!.imageURL || null
                : (null as null | string | undefined),

            limit: mode == "edit" ? eventData!.limit : undefined,
          }}
          onSubmit={async (values) => {
            if (mode === "post") {
              if (!values.imageURL) delete values.imageURL;
              if (!values.limit) delete values.limit;
              const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...values,
                  eventTime: new Date(values.eventTime!).toISOString(),
                }),
              });
              if (res.status < 400) {
                toast.success("Event successfully posted!");
                setOpen(false);
                router.push(`/events/${(await res.json()).id}`);
              } else {
                toast.error("Error posting event.");
              }
            } else {
              if (!values.limit) values.limit = null;
              const editted = Object.fromEntries(
                Object.keys(values)
                  .filter(
                    (key) =>
                      values[key as keyof typeof values]?.valueOf() !==
                      eventData![key as keyof typeof values]?.valueOf()
                  )
                  .map((key) => [key, values[key as keyof typeof values]])
              );

              if (Object.keys(editted).length === 0) {
                toast.warning("No changes were made, so nothing was updated.")
                setOpen(false);
                return;
              }

              const res = await fetch(`/api/events/${eventData!.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                  ...editted,
                  eventTime: new Date(values.eventTime!).toISOString(),
                }),
              });

              if (res.status < 400) {
                toast.success("Event successfully updated!");
                setEventData?.((await res.json()) as Event);
                setOpen(false);
              } else {
                toast.error("Error updating event.");
              }
            }
          }}
          validate={(values) => {
            const errors: any = {};
            if (!values.name) {
              errors.name = "Name is required.";
            }
            if (values.name.length > 190) {
              errors.name = "Name must be less than 190 characters.";
            }
            if (!values.description) {
              errors.description = "Description is required.";
            }
            if (!values.maxHours && !values.maxPoints) {
              errors.maxHours = errors.maxPoints =
                "Max hours or max points is required.";
            }
            if (values.maxPoints < 0) {
              errors.maxPoints = "Max points must be greater than 0.";
            }
            if (values.maxHours < 0) {
              errors.maxHours = "Max hours must be greater than 0.";
            }
            if (values.maxHours < 0) {
              errors.maxHours = "Max hours must be greater than 0.";
            }
            if (!values.eventTime) {
              errors.eventTime = "Event time is required.";
            }
            if (values.maxPoints < 0) {
              errors.maxPoints = "Max points must be greater than 0.";
            }
            if (!values.address) {
              errors.address = "Address is required.";
            }

            return errors;
          }}
        >
          {({ isSubmitting, values, setFieldValue, errors, setFieldError }) => (
            <Form autoComplete="off">
              <label htmlFor="name">Name: </label>
              <Field
                type="text"
                name="name"
                id="name"
                placeholder="Event name"
                maxLength={190}
              />
              <Error name="name" />
              <br />
              <label htmlFor="description">
                Description: ({4000 - values.description.length} chars left){" "}
              </label>
              <br />
              <Field
                as="textarea"
                name="description"
                id="description"
                maxLength={4000}
                placeholder="Event description, you can use markdown."
                className="w-full h-60 p-1 rounded-md"
              />
              <Error name="description" />
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
              <br />
              <label htmlFor="maxHours">Max Hours: </label>
              <Field
                type="number"
                name="maxHours"
                id="maxHours"
                min={0}
                step={0.25}
                placeholder="Max hours"
              />
              <br />
              <Error name="maxHours" />
              <label htmlFor="maxPoints">Max Points: </label>
              <Field
                type="number"
                name="maxPoints"
                min={0}
                id="maxPoints"
                placeholder="Max points"
              />
              <br />
              <Error name="maxPoints" />
              <label htmlFor="eventTime">Event Time: </label>
              <DateTimePicker
                onChange={(value) => {
                  setFieldValue("eventTime", value);
                  console.log(value);
                }}
                value={values.eventTime}
              />
              <br />
              <Error name="eventTime" />
              <label htmlFor="address">Address: </label>
              <Field
                type="text"
                name="address"
                id="address"
                placeholder="Address"
              />
              <br />
              <Error name="address" />
              {values.address && (
                <div>
                  <label>Preview:</label>
                  <iframe
                    src={encodeURI(
                      `https://maps.google.com/maps?q=${values.address}&t=&z=13&ie=UTF8&iwloc=&output=embed`
                    )}
                    className="w-full border-none h-60"
                  ></iframe>
                </div>
              )}
              <label htmlFor="limit">Event Limit: </label>
              <Field
                type="number"
                name="limit"
                id="limit"
                placeholder="Limit"
              />
              <br />
              <Error name="limit" />

              <label htmlFor="imageURL">Image: </label>
              <input
                type="file"
                name="imageURL"
                id="imageURL"
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
                      "imageURL",
                      "Error uploading image. You may have attached a bad file."
                    );
                    setUploading(false);
                    return;
                  }
                  const body = await res.json();
                  console.log(body);
                  setFieldValue("imageURL", body.image.url);
                  e.target.value = "";
                  setUploading(false);
                }}
              />
              <div className="w-full flex justify-center relative items-center">
                {values.imageURL ? (
                  <span className="relative">
                    <img
                      src={values.imageURL}
                      className="max-w-full max-h-44 rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 p-0 bg-black bg-opacity-20 rounded-full"
                      onClick={() => {
                        setFieldValue("imageURL", null);
                      }}
                    >
                      <BiXCircle className="w-10 h-10 text-white" />
                    </button>
                  </span>
                ) : (
                  "No image for the event."
                )}
              </div>
              <Error name="imageURL" />
              {mode === "post" ? (
                <br />
              ) : (
                <>
                  <hr />
                  <div>
                    Due to caching, it may take up to 10 seconds for the event
                    to update.
                  </div>
                </>
              )}
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

export default EventForm;
