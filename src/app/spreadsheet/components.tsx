"use client";

import { FC } from "react";
import { Data } from "./page";
import { LiaUserTieSolid } from "react-icons/lia";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@material-tailwind/react";

interface Props {
  data: Data;
  user: Data["users"][number];
}

export const PersonRow: FC<Props> = ({ data: { events, users }, user }) => {
  if (user.position === "ADMIN") return null;

  const { data } = useSession();
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
      id={user.email}
      key={user.email}
      className="hover:bg-opacity-25 bg-opacity-10 bg-white"
    >
      <td className="px-2">
        {user.email}{" "}
        {user.position === "EXEC" && (
          <LiaUserTieSolid className="inline-block" />
        )}
      </td>
      <td className="px-2">
        {totalPoints} Point{totalPoints !== 1 && "s"}, {totalCredits} Credit
        {totalCredits !== 1 && "s"}, {totalHours} Hour
        {totalHours !== 1 && "s"}
      </td>
      <td className="px-2">
        {referrals.length} Referral{referrals.length !== 1 && "s"},{" "}
        {referralPoints} Point{referralPoints !== 1 && "s"}
      </td>
      {events.map((event) => {
        const attendance = user.events.find((e) => e.eventId === event.id);
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
};

export const LoginButton: FC = () => (
  <Button
    color="blue"
    className="bg-blue-500 font-figtree p-1 text-2xl"
    onClick={() => signIn("auth0")}
  >
    Login
  </Button>
);
