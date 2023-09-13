import { Field, Form, Formik } from "formik";
import {
  Dispatch,
  FC,
  FormEvent,
  MouseEvent,
  SetStateAction,
  useState,
} from "react";
import { GRAD_YEARS as UNFILTER_GRAD } from "@/utils/constants";
import { Prisma } from "@prisma/client";
import { Button } from "@material-tailwind/react";
import FormError from "./FormError";
import { BiCheck, BiX } from "react-icons/bi";

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface BooleanSelectProps {
  falseCallback: () => void;
  trueCallback: () => void;
  bothCallback: () => void;
  data: boolean | undefined;
}
const BooleanSelect: FC<BooleanSelectProps> = ({
  data,
  falseCallback,
  trueCallback,
  bothCallback,
}) => {
  return (
    <span className="flex items-stretch">
      <button
        type="button"
        className={`${
          data === false ? "bg-red-500" : "bg-none"
        } w-8 rounded-l-full`}
        onClick={falseCallback}
      >
        <BiX
          className="w-6 h-6 mr-0 ml-auto"
          color={data === false ? "black" : "red"}
        />
      </button>
      <button
        type="button"
        className={`${
          data === undefined ? "bg-gray-500" : "bg-none"
        } w-8 rounded-none`}
        onClick={bothCallback}
      >
        /
      </button>
      <button
        type="button"
        className={`${
          data === true ? "bg-green-500" : "bg-none"
        } w-8 rounded-r-full`}
        onClick={trueCallback}
      >
        <BiCheck
          className="w-6 h-6 ml-0 mr-auto"
          color={data === true ? "black" : "green"}
        />
      </button>
    </span>
  );
};

const GRAD_YEARS = UNFILTER_GRAD.filter(Boolean).map(String);

const EmailSearcher: FC<Props> = ({ setOpen }) => {
  const [data, setData] = useState<string[] | Object>([]);
  const [customQuery, setCustomQuery] = useState(false);
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
        <h5>User Email Searcher</h5>
        <h6>
          <a
            onClick={() => {
              setOpen(false);
            }}
            className="ml-2"
          >
            Exit
          </a>
          <br />
          <a
            onClick={() => {
              setCustomQuery(!customQuery);
              setData([]);
            }}
            className="ml-2"
          >
            Switch to {customQuery ? "Simple" : "Advanced"} mode
          </a>
        </h6>
        <Formik
          initialValues={{
            eventAlerts: true as boolean | undefined,
            gradYears: GRAD_YEARS as string[] | number[],
            sgoSticker: undefined as boolean | undefined,
            customQuery: undefined as string | undefined,
          }}
          validate={(values) => {
            let errors: any = {};
            if (!values.gradYears.length) {
              errors.gradYears = "At least one grad year must be selected.";
            }
            if (values.customQuery) {
              try {
                JSON.parse(values.customQuery);
              } catch (e) {
                errors.customQuery = "Invalid JSON";
              }
            }
            return errors;
          }}
          onSubmit={async (values) => {
            const query: Prisma.UserWhereInput = values.customQuery
              ? JSON.parse(values.customQuery)
              : {
                  gradYear: {
                    in: values.gradYears.map((year) => Number(year)),
                  },
                  ...(values.eventAlerts !== undefined && {
                    eventAlerts: values.eventAlerts,
                  }),
                  ...(values.sgoSticker !== undefined && {
                    sgoSticker: values.sgoSticker,
                  }),
                };

            await fetch("/api/users", {
              method: "POST",
              body: JSON.stringify(query),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((res) => setData(res));
          }}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form autoComplete="off">
              {customQuery ? (
                <>
                  <label htmlFor="customQuery">Custom Query: </label>
                  <br />
                  <Field
                    name="customQuery"
                    id="customQuery"
                    cols={50}
                    as="textarea"
                    placeholder="If you know what you're doing or recieve precise instructions from experienced people, you can write a custom query here."
                    className="max-w-full h-96 font-[monospace]  p-1 rounded-md"
                  />
                  <br />
                  <FormError name="customQuery" />
                </>
              ) : (
                <>
                  <div className="flex flex-row justify-center py-1">
                    <label htmlFor="eventAlerts" className="pr-2">
                      Event Alerts:{" "}
                    </label>
                    <BooleanSelect
                      data={values.eventAlerts}
                      falseCallback={() => setFieldValue("eventAlerts", false)}
                      trueCallback={() => setFieldValue("eventAlerts", true)}
                      bothCallback={() =>
                        setFieldValue("eventAlerts", undefined)
                      }
                    />
                  </div>
                  <div className="flex flex-row justify-center py-1">
                    <label htmlFor="sgoSticker" className="pr-2">
                      SGO Sticker:{" "}
                    </label>
                    <BooleanSelect
                      data={values.sgoSticker}
                      falseCallback={() => setFieldValue("sgoSticker", false)}
                      trueCallback={() => setFieldValue("sgoSticker", true)}
                      bothCallback={() =>
                        setFieldValue("sgoSticker", undefined)
                      }
                    />
                  </div>
                </>
              )}
              <label>Grad Years:</label>
              <div className="w-full flex justify-center">
                <div className="flex flex-col place-items-start text-left">
                  <Field
                    type="checkbox"
                    checked={values.gradYears.length === GRAD_YEARS.length}
                    className="mr-2"
                    onChange={(e: FormEvent<HTMLInputElement>) => {
                      if (e.currentTarget.checked) {
                        setFieldValue("gradYears", GRAD_YEARS);
                      } else {
                        setFieldValue("gradYears", []);
                      }
                    }}
                  />
                  {GRAD_YEARS.map((year) => (
                    <label className="flex items-center">
                      <Field
                        key={year}
                        type="checkbox"
                        name="gradYears"
                        value={year}
                        className="mr-2 "
                      />
                      {year}
                    </label>
                  ))}
                </div>
              </div>
              <FormError name="gradYears" />
              <Button
                type="submit"
                disabled={isSubmitting}
                ripple
                className="text-xl font-raleway"
                color="light-blue"
              >
                Query{isSubmitting && "ing"} Emails
              </Button>
              <br />
              <label>Results: </label>

              <div className="flex flex-row justify-center">
                {isSubmitting
                  ? "Fetching..."
                  : Array.isArray(data)
                  ? data.length
                    ? data.join(", ")
                    : "No data."
                  : JSON.stringify(data)}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EmailSearcher;
