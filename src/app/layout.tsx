import { FC, ReactNode, Suspense } from "react";

import "./global.css";
import { AppProviders, LoadingBar } from "./providers";
import "keen-slider/keen-slider.min.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { Metadata } from "next";

interface Props {
  children: ReactNode;
}

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <Suspense>
            <LoadingBar />
          </Suspense>
          {children}
        </AppProviders>
      </body>
    </html>
  );
};

export const metadata: Metadata = {
  title: "BTHS Repair the World",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
    shortcut: "/icon.png",
  },
  description: "A BTHS club for repairing the world through acts of service.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    images: "/icon.png",
  },
  metadataBase: new URL("https://bths-repair.tech"),
};

export default RootLayout;
