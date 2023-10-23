import NextAuth, { AuthOptions, User } from "next-auth";
import Auth0Provider, { Auth0Profile } from "next-auth/providers/auth0";

const AUTH_OPTIONS: AuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const castUser = user as unknown as User & {
          id: string;
        };
        token.id = castUser.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },

    async signIn({ user }) {
      console.log(user.email?.endsWith("@nycstudents.net"), user.email?.endsWith("@schools.nyc.gov"));
      if (user.email?.endsWith("@nycstudents.net") || user.email?.endsWith("@schools.nyc.gov")) return true;
      return "/auth/invalid-email";
    }
  },
  providers: [
    Auth0Provider({
      profile(profile: Auth0Profile) {
        return {
          id: profile.sub,
          name: profile.nickname,
          email: profile.email,
          image: profile.picture,
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
