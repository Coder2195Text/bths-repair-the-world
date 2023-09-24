import { UserFull } from "@/types/user";
import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  const events = await prisma.event.findMany({
    select: {
      name: true,
      maxHours: true,
      maxPoints: true,
      eventTime: true,
    },
  });

  const users = await prisma.user.findMany({
    select: {
      email: true,
      events: {
        select: {
          earnedHours: true,
          earnedPoints: true,
        },
      },
    },
  });

  return NextResponse.json(
    {
      events,
      users,
    },
    {
      status: 200,
    }
  );
}
