import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <main className="flex flex-col items-center gap-6 px-3 py-10">
      <h1 className="text-center text-4xl font-bold">
        Welcome to the Media Transfer App
      </h1>
      <p></p>
    </main>
  );
}
