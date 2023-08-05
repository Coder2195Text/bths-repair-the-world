import NextAuth, { AuthOptions, User } from "next-auth";
import Auth0Provider, { Auth0Profile } from "next-auth/providers/auth0";

const AUTH_OPTIONS: AuthOptions = {
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        const castUser = user as unknown as User & {
          email_verified: boolean;
          id: string;
        };
        token.email_verified = castUser.email_verified; // pull that out
        token.id = castUser.id;
      }
      return token;
    },

    async session({ session, token, newSession }) {
      session.user.email_verified = token.email_verified; // pull that out
      session.user.id = token.id;
      return session;
    },
  },
  providers: [
    Auth0Provider({
      profile(profile: Auth0Profile) {
        return {
          id: profile.sub,
          name: profile.nickname,
          email: profile.email,
          image: profile.picture,
          email_verified: profile.email_verified, // add the attribute here
        };
      },

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
