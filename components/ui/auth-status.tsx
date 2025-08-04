"use client";

import { useSession } from "next-auth/react";
import { Button } from "./button";
import Link from "next/link";

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Not signed in</span>
        <Link href="/auth/signin">
          <Button size="sm" variant="outline">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">
        Signed in as {session.user?.name || session.user?.email}
      </span>
      {session.user?.role === "ADMIN" && (
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          Admin
        </span>
      )}
      <Link href="/signout">
        <Button size="sm" variant="outline">
          Sign Out
        </Button>
      </Link>
    </div>
  );
} 