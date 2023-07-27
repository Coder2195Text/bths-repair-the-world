import { Button, Collapse } from "@material-tailwind/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { signOut } from "next-auth/react";
import { FC, MouseEvent, useState } from "react";
import { BsExclamationOctagon } from "react-icons/bs";

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

const GRAD_YEARS = [0, 2024, 2025, 2026, 2027];

const RegisterForm: FC = () => {
  const [prefectDetails, setPrefectDetails] = useState(false);
  return (
    <div className="flex overflow-auto fixed inset-0 z-40 justify-center items-center w-screen h-screen text-black bg-black bg-opacity-50">
      <div className="overflow-y-auto overflow-x-visible text-center bg-blue-100 rounded-lg lg:p-8 p-[3.2vw] max-h-[90vh]">
        <h5 className="font-bold">Wait! You have to register!!!</h5>
        <h6>
          Not expecting this?
          <a onClick={() => signOut()} className="ml-2">
            Sign Out
          </a>
        </h6>
        <hr className="mt-3 w-full border-2 border-black" />
        <Formik
          initialValues={{
            name: "",
            preferredName: "",
            osis: "",
            prefect: "",
            pronouns: "",
            gradYear: "",
            birthday: undefined as string | undefined,
            referredBy: "",
          }}
          onSubmit={async (values) => {
            console.log(values);
          }}
          validate={(values) => {
            const errors: any = {};
            if (!values.name) {
              errors.name = "Name is required";
            }
            if (values.name?.length > 180) {
              errors.name = "Name is too long";
            }
            if (values.preferredName?.length > 180) {
              errors.preferredName = "Preferred name is too long";
            }
            if (!values.osis) {
              errors.osis = "OSIS is required";
            } else {
              if (values.osis?.toString().length !== 9) {
                errors.osis = "OSIS must be 9 digits";
              }
              if (values.osis?.toString().match(/[^0-9]/g)) {
                if (!errors.osis) {
                  errors.osis = "OSIS must be only numbers";
                } else {
                  errors.osis += " and only numbers";
                }
              }
            }
            if (!values.prefect) {
              errors.prefect = "Prefect is required";
            } else {
              if (values.prefect.length !== 3) {
                errors.prefect = "Prefect must be 3 characters";
              }
              if (!values.prefect.match(/^[A-Za-z]\d[A-Za-z]$/)) {
                if (!errors.prefect) {
                  errors.prefect = "Prefect must be in the format A1B";
                } else {
                  errors.prefect += " and in the format A1B";
                }
              }
            }
            if (!values.pronouns) {
              errors.pronouns = "Pronouns are required";
            }

            if (values.pronouns?.length > 180) {
              errors.pronouns = "Pronouns are absurdly long";
            }

            if (!values.gradYear) {
              errors.gradYear = "Graduation year is required";
            }

            if (!values.birthday) {
              errors.birthday = "Birthday is required";
            } else {
              const birthDate = new Date(values.birthday);
              console.log(birthDate);
              if (birthDate.valueOf() >= new Date().valueOf()) {
                errors.birthday = "Birthday must be in the past";
              }
              if (birthDate.getFullYear() > 2012) {
                if (errors.birthday) {
                  errors.birthday +=
                    " and you seem to young to be in high school.";
                } else {
                  errors.birthday = "You seem to young to be in high school.";
                }
              }
            }

            return errors;
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <label htmlFor="name">Full Legal Name: </label>
              <Field
                id="name"
                name="name"
                type="text"
                maxLength={180}
                placeholder="Your name"
              />
              <br />
              <Error name="name" />
              <label htmlFor="preferredName">Preferred Name (Optional): </label>
              <Field
                id="preferredName"
                name="preferredName"
                type="text"
                maxLength={180}
                placeholder={values.name || "Your preferred name"}
              />
              <br />
              <Error name="preferredName" />
              <label htmlFor="osis">OSIS #: </label>
              <Field
                id="osis"
                name="osis"
                type="text"
                maxLength={9}
                placeholder="Your 9 digit OSIS"
              />
              <br />
              <Error name="osis" />
              <label htmlFor="prefect">Prefect: </label>
              <Field
                className="w-16"
                id="prefect"
                name="prefect"
                type="text"
                maxLength={3}
                placeholder="A1B"
              />
              <a
                className="mx-1"
                onClick={() => setPrefectDetails(!prefectDetails)}
              >
                {prefectDetails ? "Close help" : "Need help?"}
              </a>
              <Collapse open={prefectDetails}>
                <div className="text-lg">
                  Go get your transcript via teachhub, and look for something
                  that says "Offical Class", input the 3 digit code, that looks
                  like this "A1B"
                </div>
              </Collapse>
              <Error name="prefect" />
              <label htmlFor="pronouns">Pronouns: </label>
              <Field
                id="pronouns"
                name="pronouns"
                type="text"
                maxLength={180}
                placeholder="he/him, she/her, they/them, etc."
              />
              <br />
              <Error name="pronouns" />
              <label htmlFor="gradYear">Graduation Year: </label>
              <Field id="gradYear" name="gradYear" as="select">
                {GRAD_YEARS.map((year) => (
                  <option value={year || ""}>{year || "Not Selected"}</option>
                ))}
              </Field>
              <br />
              <Error name="gradYear" />
              <label htmlFor="birthday">Birthday: </label>
              <Field id="birthday" name="birthday" type="date" />
              <br />
              <Error name="birthday" />
              <label htmlFor="referredBy">Referred By: </label>
              <Field
                id="referredBy"
                name="referredBy"
                type="text"
                maxLength={180}
                placeholder="Who referred you?"
              />
              <br />
              <Error name="referredBy" />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterForm;
