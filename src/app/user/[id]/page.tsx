import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import UploadForm from "./UploadForm";
import ImageGrid from "./ImageGrid";

interface PageProps {
  params: { id: string };
}

const getUser = cache(async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, image: true, createdAt: true },
  });
});

export async function generateStaticParams() {
  const allUsers = await prisma.user.findMany();

  return allUsers.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params: { id } }: PageProps) {
  const user = await getUser(id);

  return {
    title: user?.name || `User ${id}`,
  };
}

export default async function Page({ params: { id } }: PageProps) {
  // Artificial delay to showcase static caching
  // await new Promise((resolve) => setTimeout(resolve, 1500));

  const user = await getUser(id);

  if (!user) notFound();

  return (
    <div className="mx-3 my-10 flex flex-col items-center gap-3">
      {user.image && (
        <img
          src={user.image || "/avatar_placeholder.png"}
          width={100}
          alt="User profile picture"
          height={100}
          className="rounded-full"
        />
      )}
      <h1 className="text-center text-xl font-bold">
        {user?.name || `User ${id}`}
      </h1>
      <p className="text-muted-foreground">
        User since {new Date(user.createdAt).toLocaleDateString()}
      </p>
      <UploadForm />
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4">
          <h2 className="text-2xl font-bold">Your Media</h2>
        </div>
        <ImageGrid />
      </div>
    </div>
  );
}
