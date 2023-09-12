import { ErrorMessage } from "formik";
import { FC } from "react";
import { BsExclamationOctagon } from "react-icons/bs";

const FormError: FC<{ name: string }> = (props) => {
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

export default FormError;
