import { FC, MouseEvent, PropsWithChildren, useEffect } from "react";

const PopupUI: FC<
  PropsWithChildren<{
    disabledExit?: boolean;
    setOpen: ((a: boolean) => any) | undefined;
  }>
> = ({ children, setOpen }) => {
  function handleEsc(event: KeyboardEvent) {
    if (event.key === "Escape") {
      setOpen?.(false);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);
  return (
    <div
      className="flex fixed inset-0 z-40 flex-row justify-center items-center w-screen h-screen text-black bg-black bg-opacity-50 py-8"
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          setOpen?.(false);
        }
      }}
    >
      <div className="overflow-auto max-w-5xl max-h-full text-center bg-blue-100 rounded-lg lg:p-8 p-[3.2vw]">
        {children}
      </div>
    </div>
  );
};

export default PopupUI;
