import { FC, PropsWithChildren } from "react";
import { BarLoader } from "react-spinners";

export const Loading: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="mt-5 text-center">
      <h5>{children}</h5>
      <div className="flex justify-center w-full">
        <BarLoader color="#2563EB" className="my-3" width={600} height={10} />
      </div>
    </div>
  );
};
