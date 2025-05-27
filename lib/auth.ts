import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { db } from "./db";
import { Console } from "console";

const pepper = process.env.PEPPER_SECRET || "";

const RATE_LIMIT = {
  MAX_ATTEMPTS: 50,
  LOCKOUT_DURATION: 10 * 60 * 1000,
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 10 * 60,
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const existingUser = await db.user.findUnique({
            where: { EMail: credentials.email },
          });

          if (!existingUser) {
            await trackFailedAttempt(credentials.email, req);
            return null;
          }

          const isLocked = await checkLockout(credentials.email, req);
          if (isLocked) {
            throw new Error("TOO_MANY_ATTEMPTS");
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password + pepper,
            existingUser.Password,
          );

          if (!passwordMatch) {
            await trackFailedAttempt(credentials.email, req);
            return null;
          }

          await resetFailedAttempts(credentials.email, req);

          return {
            id: existingUser.UserID,
            email: existingUser.EMail,
            role: existingUser.Role,
          };
        } catch (error: unknown) {
          if (error instanceof Error && error.message === "TOO_MANY_ATTEMPTS") {
            throw error;
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          email: token.email,
        },
      };
    },
  },
};
async function trackFailedAttempt(email: string, req: any) {
  const ip =
    req.headers?.["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  try {
    const existingAttempt = await db.loginAttempt.findFirst({
      where: {
        username: email,
        ip: ip,
      },
    });

    const now = new Date();

    if (existingAttempt) {
      const resetAttempts =
        existingAttempt.lastAttempt &&
        now.getTime() - existingAttempt.lastAttempt.getTime() >
          24 * 60 * 60 * 1000;

      const newAttemptCount = resetAttempts ? 1 : existingAttempt.attempts + 1;

      let lockedUntil = null;
      if (newAttemptCount >= RATE_LIMIT.MAX_ATTEMPTS) {
        lockedUntil = new Date(now.getTime() + RATE_LIMIT.LOCKOUT_DURATION);
      }

      await db.loginAttempt.update({
        where: { id: existingAttempt.id },
        data: {
          attempts: newAttemptCount,
          lastAttempt: now,
          lockedUntil,
        },
      });
    } else {
      await db.loginAttempt.create({
        data: {
          username: email,
          ip,
          attempts: 1,
          lastAttempt: now,
          lockedUntil: null,
        },
      });
    }
  } catch (error) {
    console.error("Error tracking login attempt:", error);
  }
}

async function checkLockout(email: string, req: any): Promise<boolean> {
  const ip =
    req.headers?.["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  try {
    const loginAttempt = await db.loginAttempt.findFirst({
      where: {
        username: email,
        ip,
      },
    });

    if (loginAttempt?.lockedUntil) {
      const now = new Date();
      if (loginAttempt.lockedUntil > now) {
        return true;
      }

      await db.loginAttempt.update({
        where: { id: loginAttempt.id },
        data: { lockedUntil: null },
      });
    }

    return false;
  } catch (error) {
    console.error("Error checking lockout status:", error);
    return false;
  }
}

async function resetFailedAttempts(email: string, req: any) {
  const ip =
    req.headers?.["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  try {
    const loginAttempt = await db.loginAttempt.findFirst({
      where: {
        username: email,
        ip,
      },
    });

    if (loginAttempt) {
      await db.loginAttempt.update({
        where: { id: loginAttempt.id },
        data: {
          attempts: 0,
          lockedUntil: null,
        },
      });
    }
  } catch (error) {
    console.error("Error resetting login attempts:", error);
  }
}
