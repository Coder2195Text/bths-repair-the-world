import { FC, ReactNode } from "react";

import "./global.css";
import { NextAuthProvider } from "./providers";
import "keen-slider/keen-slider.min.css";

interface Props {
  children: ReactNode;
}

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
