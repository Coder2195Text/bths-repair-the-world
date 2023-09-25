import { UserFull } from "@/types/user";
import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const events = await prisma.event.findMany({
    select: {
      name: true,
      maxHours: true,
      maxPoints: true,
      eventTime: true,
      id: true,
    },
  });

  const users = await prisma.user.findMany({
    select: {
      email: true,
      position: true,
      referredBy: true,
      events: {
        select: {
          eventId: true,
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
