import { FC, useEffect, useState } from "react";
import Confetti from "react-dom-confetti";

const BirthdayPopup: FC = () => {
  const [show, setShow] = useState(true);
  const [confetti, setConfetti] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setConfetti(true);
    }, 500);
  });
  if (!show) return;
  return (
    <div className="flex fixed inset-0 z-40 justify-center items-center w-screen h-screen text-black bg-black bg-opacity-50">
      <div className="flex overflow-visible flex-col justify-center items-center p-8 rounded-lg birthday">
        <h5 className="font-bold">Happy Birthday!</h5>
        <p className="mb-4">
          Don't think we forgot, did you? We hope you have a great day!
        </p>
        <button
          className="py-2 px-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          onClick={() => {
            setShow(false);
          }}
        >
          Close
        </button>
        <Confetti
          active={confetti}
          config={{
            angle: 90,
            spread: 190,
            startVelocity: 60,
            elementCount: 150,
            dragFriction: 0.09,
            duration: 10000,
            stagger: 0,
            width: "20px",
            height: "20px",
            colors: [
              "#FFB6C1",
              "#FFDAB9",
              "#FFE4B5",
              "#F0FFF0",
              "#E0FFFF",
              "#D8BFD8",
              "#FFC0CB",
              "#87CEEB",
              "#FFA07A",
              "#98FB98",
            ],
          }}
        />
      </div>
    </div>
  );
};

export default BirthdayPopup;
