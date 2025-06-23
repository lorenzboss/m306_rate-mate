"use server";

import { db } from "@/lib/db";
import { requireTeamLeader } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type User = {
  UserID: string;
  Role: number;
  EMail: string;
  Password: string;
  Salt: string;
};

export async function getAllUsers(): Promise<User[]> {
  try {
    if (!(await requireTeamLeader())) {
      throw new Error("You may not access this resource");
    }

    const users = await db.user.findMany();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    if (!(await requireTeamLeader())) {
      throw new Error("Unauthorized");
    }

    if (!userId) {
      throw new Error("Missing user id");
    }

    await db.user.delete({
      where: { UserID: userId },
    });

    // Revalidate the page to reflect the changes
    revalidatePath("/users");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Error deleting user");
  }
}
