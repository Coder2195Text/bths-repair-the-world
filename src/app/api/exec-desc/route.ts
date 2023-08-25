import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const body = await prisma.user.findMany({
    where: {
      position: {
        in: ["EXEC"],
      },
    },

    select: {
      execDetails: true,
      name: true,
      preferredName: true,
      pronouns: true,
      gradYear: true,
      email: true,
    },

    orderBy: {
      execDetails: {
        position: "asc",
      },
      name: "asc",
    },
  });

  return NextResponse.json(body, {
    status: 200,
  });
}
