import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_OPTIONS } from "../auth/[...nextauth]/route";
import { Redis } from "ioredis";

export async function POST(_req: NextRequest) {
  const verify = new Redis(process.env.REDIS_DB_URL!, {
    keyPrefix: "verify:",
  });
  const redis = new Redis(process.env.REDIS_DB_URL!);
  const session = await getServerSession({ ...AUTH_OPTIONS });

  const id = session?.user?.id;

  if (!id || session.user.email_verified) {
    return NextResponse.json({ error: "Not Allowed" }, { status: 401 });
  }

  let lastSent = await verify.get(id);

  if (lastSent) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let accessToken = (await redis.get("accessToken")) as string | undefined;

  if (!accessToken) {
    const newToken = await fetch(
      "https://bths-repair.us.auth0.com/oauth/token",
      {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: process.env.AUTH0_API_AUDIENCE,
          grant_type: "client_credentials",
        }),
      }
    ).then((res) => res.json());

    console.log(newToken);

    if (typeof newToken.access_token !== "string")
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );

    accessToken = newToken.access_token;
    await redis.set("accessToken", newToken.access_token, "EX", 43200);
  }

  const request = await fetch(
    "https://bths-repair.us.auth0.com/api/v2/jobs/verification-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        user_id: id,
        client_id: process.env.AUTH0_API_CLIENT,
        identity: {
          user_id: id.replace("auth0|", ""),
          provider: "auth0",
        },
      }),
    }
  );

  await verify.set(session.user.id, "_", "EX", 20);
  return NextResponse.json(request.json(), { status: request.status });
}
