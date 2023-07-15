import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { AUTH_OPTIONS } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

type Params = { params: { email: string } };

export async function GET(_req: NextRequest, { params: { email } }: Params) {
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

export async function POST(req: NextRequest, { params: { email } }: Params) {
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const body = await req.body
    ?.getReader()
    .read()
    .then((r) => r.value && new TextDecoder().decode(r.value));
}
