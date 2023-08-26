import { ExecDetails, ExecPosition, User } from "@prisma/client";
import { FC, Suspense } from "react";
import { ExecCard } from "./components";
import { Loading } from "@/components/Loading";

async function fetchExecs() {
  return {};
}

export type ExecsDetails = ({
  execDetails?: ExecDetails;
} & Pick<User, "name" | "preferredName" | "gradYear" | "pronouns" | "email">)[];

const AsyncExecList: FC = async () => {
  const execs = (await fetchExecs()) as ExecsDetails;
  execs.sort(function compareModels(a, b) {
    const positions: {
      [key in ExecPosition | "undefined"]: number;
    } = {
      PRESIDENT: 1,
      VICE_PRESIDENT: 2,
      TREASURER: 3,
      EVENT_COORDINATOR: 4,
      undefined: 5,
    };

    // Compare positions first
    const positionComparison =
      positions[String(a.execDetails?.position) as ExecPosition] -
      positions[String(b.execDetails?.position) as ExecPosition];

    if (positionComparison !== 0) {
      return positionComparison;
    }

    // If positions are the same, compare names
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {execs.map((info) => (
        <ExecCard info={info} key={info.email} />
      ))}
    </div>
  );
};

export const ExecList: FC = () => {
  return (
    <Suspense fallback={<Loading>Loading Executives...</Loading>}>
      <AsyncExecList />
    </Suspense>
  );
};
