import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

// Admin = 3
// Team Leader = 2
// User = 1

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireSession() {
  const session = await getSession();
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  if (session?.user?.role !== 3) {
    return null;
  }
  return session;
}

export async function requireTeamLeader() {
  const session = await requireSession();
  if (session?.user?.role !== 2 && session?.user?.role !== 3) {
    return null;
  }
  return session;
}

export async function requireUser() {
  const session = await requireSession();
  if (
    session?.user?.role !== 1 &&
    session?.user?.role !== 2 &&
    session?.user?.role !== 3
  ) {
    return null;
  }
  return session;
}
