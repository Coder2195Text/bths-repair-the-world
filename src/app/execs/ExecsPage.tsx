import Layout from "@/components/Layout";
import { FC } from "react";
import type { ExecsDetails } from "./page";

interface Props {
  execs: ExecsDetails;
}

const ExecsPage: FC<Props> = ({ execs }) => {
  return (
    <Layout>
      <h1>Our Exec Team</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {execs.map(
          ({ execDetails, name, preferredName, gradYear, pronouns, email }) => (
            <div key={email} className="bg-gray-600 rounded-lg p-4">
              <h3 className="text-2xl font-bold">
                {preferredName} ({name})
              </h3>
              <h6 className="text-lg">{pronouns}</h6>
              <p className="text-lg">{gradYear}</p>
              <p className="text-lg">{execDetails?.position}</p>
            </div>
          )
        )}
      </div>
    </Layout>
  );
};

export default ExecsPage;
