import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    email: string;
    role: number;
    id: string;
  }

  interface Session {
    user: {
      email: string;
      role: number;
      id: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: number;
  }
}
