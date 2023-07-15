import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { AUTH_OPTIONS } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params: { email } }: { params: { email: string } }
) {
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (email == "@me") {
    const session = await getServerSession({ ...AUTH_OPTIONS });
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    console.log(session);
    email = session.user.email;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  return NextResponse.json(user, { status: 200 });
}
