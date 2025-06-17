import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const session = await requireSession();

    if (session?.user?.role !== 2) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const userId = url.pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    await db.user.delete({
      where: { UserID: userId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}
