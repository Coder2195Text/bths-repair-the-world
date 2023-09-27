"use client";
import { FC, Suspense } from "react";
import type { Data } from "./page";
import { Loading } from "@/components/Loading";
import Link from "next/link";
import { BiLinkAlt } from "react-icons/bi";
import { LiaUserTieSolid } from "react-icons/lia";
import { PersonRow } from "./components";
import { useSession } from "next-auth/react";

interface Props {
  data: Promise<Data>;
}

const AsyncSpreadsheet: FC<Props> = async ({ data }) => {
  const { events, users } = await data;
  return (
    <div className="overflow-auto p-2 ">
      <table className="table-auto members-spreadsheet bg-blue-gray-600">
        <tr className=" bg-blue-800">
          <th className="px-2">Email</th>
          <th className="px-20">Summary</th>
          <th className="px-16">Referrals (Max 20)</th>
          {events.map((event) => (
            <th key={event.id} className="min-w-[400px]">
              <Link
                href={"/events/" + event.id}
                className="text-white hover:text-gray-500 "
              >
                {event.name} on{" "}
                {new Date(event.eventTime).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                <BiLinkAlt className="inline-block ml-2" />
              </Link>
            </th>
          ))}
        </tr>

        {users.map((user) => (
          <PersonRow data={{ events, users }} user={user} />
        ))}
      </table>
    </div>
  );
};

export const Spreadsheet: FC<Props> = ({ data }) => {
  return (
    <Suspense
      fallback={<Loading>Loading Points and Hours Spreadsheet...</Loading>}
    >
      <AsyncSpreadsheet data={data} />
    </Suspense>
  );
};
