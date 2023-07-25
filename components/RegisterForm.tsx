import { Button } from "@material-tailwind/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { signOut } from "next-auth/react";
import { FC } from "react";
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

const RegisterForm: FC = () => {
  return (
    <div className="flex fixed inset-0 z-40 justify-center items-center w-screen h-screen text-black bg-black bg-opacity-50">
      <div className="flex overflow-visible flex-col justify-center items-center bg-blue-100 rounded-lg lg:p-8 p-[3.2vw]">
        <h5 className="font-bold">Wait! You have to register!!!</h5>
        <h6>
          Not expecting this?
          <a
            onClick={() => signOut()}
            className="ml-2 text-blue-500 transition-all hover:text-blue-900 hover:cursor-pointer"
          >
            Sign Out
          </a>
        </h6>
        <hr className="mt-3 w-full border-2 border-black" />
        <Formik
          initialValues={{
            name: "",
            preferredName: "",
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
                placeHolder="Your name"
              />
              <br />
              <Error name="name" />
              <label htmlFor="preferredName">Preferred Name (Optional): </label>
              <Field
                id="preferredName"
                name="preferredName"
                type="text"
                maxLength={180}
                placeHolder={values.name || "Your preferred name"}
              />
              <br />
              <Error name="preferredName" />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterForm;
