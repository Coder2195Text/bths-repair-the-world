import NextAuth, { AuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

const AUTH_OPTIONS: AuthOptions = {
  providers: [
    Auth0Provider({
      authorization: {
        params: {
          prompt: "login",
        },
      },
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(AUTH_OPTIONS);

export { handler as GET, handler as POST, AUTH_OPTIONS };
