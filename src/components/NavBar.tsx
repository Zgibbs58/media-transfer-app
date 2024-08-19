"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import UserButton from "./UserButton";
import getSession from "@/lib/getSession";
import { useSession, signIn } from "next-auth/react";
import { ModeToggle } from "./ui/mode-toggle";

export default function NavBar() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <header className="sticky top-0 bg-background px-3 shadow-sm">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3">
        <Link href="/" className="font-bold">
          Media Transfer App
        </Link>
        <div className="flex space-x-4">
          <ModeToggle />
          {user && <UserButton user={user} />}
          {!user && session.status !== "loading" && <SignInButton />}
        </div>
      </nav>
    </header>
  );
}

//https://authjs.dev/getting-started/authentication/credentials
function SignInButton() {
  return <Button onClick={() => signIn()}>Sign In</Button>;
}
