"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";

export default function Logout() {
  return (
    <button
      className="transition-all duration-300 hover:scale-115"
      onClick={() => signOut()}
    >
      <LogOut className="hover:text-violet-500" />
    </button>
  );
}
