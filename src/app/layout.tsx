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

export const metadata = {
  title: "BTHS Repair the World",
  description: "Inspring BTHS youth to make change in a unjust society.",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    images: "https://bths-repair.tech/favicon.ico",
  },
};

export default RootLayout;
