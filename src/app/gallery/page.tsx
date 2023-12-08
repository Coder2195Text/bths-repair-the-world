import Layout from "@/components/Layout";
import { FC } from "react";

export const metadata = {
  title: "Gallery",
  description: "Gallery page for BTHS Action.",
};

const Page: FC = () => {
  return (
    <Layout>
      <h1>Gallery</h1>
      <div
        className="relative w-full h-0 pt-[56.25%] pb-0 mt-6 mb-4 overflow-hidden rounded-lg will-change-transform brightness-75 hover:brightness-100 transition-all duration-300 ease-in-out"
        style={{
          boxShadow: "0 10px 40px 0 rgba(200,200,200,1)",
        }}
      >
        <iframe
          loading="lazy"
          className="absolute w-full h-full top-0 left-0 border-none p-0 m-0"
          src="https://www.canva.com/design/DAFs35PNYB4/view?embed"
          allowFullScreen
          allow="fullscreen"
        ></iframe>
      </div>
    </Layout>
  );
};

export default Page;
