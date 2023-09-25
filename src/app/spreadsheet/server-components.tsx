"use client";
import { FC, Suspense } from "react";
import type { Data } from "./page";
import { Loading } from "@/components/Loading";
import Link from "next/link";
import { BiLinkAlt } from "react-icons/bi";
import { LiaUserTieSolid } from "react-icons/lia";

interface Props {
  data: Promise<Data>;
}

const AsyncSpreadsheet: FC<Props> = async ({ data }) => {
  const { events, users } = await data;
  return (
    <div className="overflow-auto p-2 ">
      <table className="table-auto members-spreadsheet bg-blue-gray-500">
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

        {users.map((user) => {
          if (user.position === "ADMIN") return null;
          const referrals = users
            .filter((u) => u.referredBy === user.email)
            .map((u) => u.email);

          const referralPoints = Math.min(referrals.length, 20) * 5;

          const [totalPoints, totalHours] = [
            user.position === "EXEC"
              ? 200
              : user.events.reduce((acc, curr) => acc + curr.earnedPoints, 0) +
                referralPoints,
            user.events.reduce((acc, curr) => acc + curr.earnedHours, 0),
          ];

          const totalCredits = Math.floor(Math.min(totalPoints / 25, 8));

          return (
            <tr
              key={user.email}
              className="hover:bg-opacity-25 bg-opacity-0 bg-white"
            >
              <td className="px-2">
                {user.email}{" "}
                {user.position === "EXEC" && (
                  <LiaUserTieSolid className="inline-block" />
                )}
              </td>
              <td className="px-2">
                {totalPoints} Point{totalPoints !== 1 && "s"}, {totalCredits}{" "}
                Credit{totalCredits !== 1 && "s"}, {totalHours} Hour
                {totalHours !== 1 && "s"}
              </td>
              <td className="px-2">
                {referrals.length} Referral{referrals.length !== 1 && "s"},{" "}
                {referralPoints} Point{referralPoints !== 1 && "s"}
              </td>
              {events.map((event) => {
                const attendance = user.events.find(
                  (e) => e.eventId === event.id
                );
                return (
                  <td key={event.id}>
                    {attendance?.earnedPoints || 0} Point
                    {attendance?.earnedPoints !== 1 && "s"},{" "}
                    {attendance?.earnedHours || 0} Hour
                    {attendance?.earnedHours !== 1 && "s"}
                  </td>
                );
              })}
            </tr>
          );
        })}
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
