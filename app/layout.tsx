import { FC, ReactNode } from "react";

import "./global.css";
import { NextAuthProvider } from "./providers";

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

export const metadata = {
  title: "Repair the World",
  description: "Inspring BTHS youth to make change in a unjust society.",
};

export default RootLayout;
