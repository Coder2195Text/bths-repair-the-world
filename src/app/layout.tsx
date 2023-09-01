import { FC, ReactNode, Suspense } from "react";

import "./global.css";
import { AppProviders } from "./providers";
import "keen-slider/keen-slider.min.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

interface Props {
  children: ReactNode;
}

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
};

export const metadata = {
  title: "BTHS Repair the World",
  description: "A BTHS club for repairing the world through acts of service.",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    images: "/icon.png",
  },
};
export default RootLayout;
