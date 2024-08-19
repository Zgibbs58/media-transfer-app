import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function Page() {
  // Redirect non-admin users
  const session = await getSession();
  const user = session?.user;

  const users = await prisma.user.findMany();

  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  if (user.role !== "admin") {
    return (
      <main className="mx-auto my-10 space-y-3">
        <h1 className="text-center text-xl font-bold">Admin Page</h1>
        <p className="text-center">
          You are not authorized to access this page.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto my-10 space-y-3 text-center">
      <h1 className="text-center text-xl font-bold">Admin Page</h1>
      <h2 className="text-center text-2xl font-semibold">Users</h2>
      <ul className="list-inside list-disc">
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/user/${user.id}`} className="hover:underline">
              {user.name || `User: ${user.id}`}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
