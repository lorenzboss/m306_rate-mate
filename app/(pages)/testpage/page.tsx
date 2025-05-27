"use client";

//This page is a demo for how to use the session validation

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Testpage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user.role !== 2) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="place-items-center p-8 text-center sm:p-20 sm:text-left">
      <h1 className="m-8 text-4xl font-bold">Welcome to Next.js!</h1>
      <p className="mt-4 text-lg">
        Get started by editing <code className="font-mono">app/page.tsx</code>
      </p>
    </div>
  );
}
