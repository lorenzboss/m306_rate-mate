"use client";

import {
  deleteUser,
  getAllUsers,
  User,
} from "@/app/actions/user-management-actions";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user.role == 2 || session?.user.role == 3) {
    } else {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        // Filter out users missing required fields
        const validUsers = fetchedUsers.filter(
          (user): user is User =>
            typeof user.UserID === "string" &&
            typeof user.EMail === "string" &&
            typeof user.Role === "number",
        );
        setUsers(validUsers);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading users");
      }
    };

    loadUsers();
  }, []);

  const handleDeleteRequest = (userId: string) => {
    setSelectedUserId(userId);
    setShowDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;

    startTransition(async () => {
      try {
        await deleteUser(selectedUserId);
        setUsers((prev) =>
          prev.filter((user) => user.UserID !== selectedUserId),
        );
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete user");
      } finally {
        setShowDialog(false);
        setSelectedUserId(null);
      }
    });
  };

  const roleMap: { [key: number]: string } = {
    3: "Admin",
    2: "Team Leader",
    1: "User",
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl p-8">
      <h1 className="mb-8 border-b border-gray-300 pb-3 text-3xl font-extrabold text-gray-900">
        User Management
      </h1>

      {error && (
        <div className="mb-6 rounded bg-red-100 px-4 py-3 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {users.length === 0 && !error && (
        <p className="text-center text-gray-500">No Users found.</p>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.UserID}
            className="flex flex-col justify-between gap-5 rounded-lg border border-gray-300 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
          >
            <div className="mb-3 sm:mb-0">
              <p className="text-lg font-semibold text-gray-800">
                {user.EMail}
              </p>
              <p className="text-sm text-gray-500">
                Role: {roleMap[user.Role] || "Unknown"}
              </p>
            </div>

            <button
              onClick={() => handleDeleteRequest(user.UserID)}
              disabled={isPending}
            >
              <Trash2
                className={`h-10 cursor-pointer text-red-500 transition-all duration-300 hover:scale-115 ${isPending ? "opacity-50" : ""}`}
              />
            </button>
          </div>
        ))}
      </div>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this user?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDialog(false);
                  setSelectedUserId(null);
                }}
                className="rounded bg-gray-200 px-4 py-2 text-gray-800 transition-all duration-300 hover:scale-95 hover:bg-gray-300"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded bg-red-600 px-4 py-2 text-white transition-all duration-300 hover:scale-95 hover:bg-red-700"
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
