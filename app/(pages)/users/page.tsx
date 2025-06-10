"use client";

import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type User = {
  UserID: string;
  Role: number;
  EMail: string;
  Password: string;
  Salt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/getall")
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error Loading");
        }
        return res.json();
      })
      .then(setUsers)
      .catch((err) => setError(err.message));
  }, []);

  const handleDeleteRequest = (userId: string) => {
    setSelectedUserId(userId);
    setShowDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) return;

    const res = await fetch(`/api/user/${selectedUserId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setUsers((prev) => prev.filter((user) => user.UserID !== selectedUserId));
      setError(null);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to delete");
    }

    setShowDialog(false);
    setSelectedUserId(null);
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
                Role: {user.Role === 2 ? "Admin" : "User"}
              </p>
            </div>

            <button onClick={() => handleDeleteRequest(user.UserID)}>
              <Trash2 className="h-10 cursor-pointer text-red-500 transition-all duration-300 hover:scale-115" />
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
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded bg-red-600 px-4 py-2 text-white transition-all duration-300 hover:scale-95 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
