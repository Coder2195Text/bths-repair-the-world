import { Button } from "@material-tailwind/react";
import { signOut } from "next-auth/react";
import { FC } from "react";

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
      </div>
    </div>
  );
};

export default RegisterForm;
