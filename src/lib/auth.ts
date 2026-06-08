export const runtime = "nodejs";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const googleAuthEnabled = !!(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

const providers: NextAuthConfig["providers"] = [];

if (googleAuthEnabled) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Lets a user who originally signed up with email/password sign in via
      // Google when both accounts use the same email. Safe here because Google
      // verifies emails before sharing them.
      allowDangerousEmailAccountLinking: true,
    })
  );
}

providers.push(
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.email || !credentials?.password) {
          console.error("[auth] missing email or password in submission");
          return null;
        }

        const email = (credentials.email as string).trim();
        console.error("[auth] login attempt for:", email);

        // Case-insensitive lookup so "User@x.com" matches "user@x.com" etc.
        const user = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
          select: { id: true, email: true, name: true, password: true },
        });

        if (!user) {
          console.error("[auth] no user found with that email");
          return null;
        }
        if (!user.password) {
          console.error("[auth] user has no password set (likely OAuth signup)");
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          console.error("[auth] password mismatch for", email);
          return null;
        }

        console.error("[auth] login OK for", email);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      } catch (err) {
        console.error("[auth] authorize() threw:", err);
        return null;
      }
    },
  })
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as never,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      } else if (token.email && !token.id) {
        // OAuth sign-in: the adapter creates the User row but the credentials
        // callback path is skipped, so backfill the id from the DB once.
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true },
        });
        if (dbUser) token.id = dbUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
