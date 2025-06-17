//This is a demo on how to use session in api enpoints

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireSession() {
  const session = await getSession();
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  if (session?.user?.role !== 2) {
    return null;
  }
  return session;
}
