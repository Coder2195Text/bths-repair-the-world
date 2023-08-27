import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.nextUrl);
  const refresh = searchParams.get("refresh");

  const body = await prisma.user.findMany({
    where: {
      position: {
        in: ["EXEC"],
      },
      email: {
        not: String(refresh),
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
  });

  return NextResponse.json(body, {
    status: 200,
    headers: {},
  });
}
