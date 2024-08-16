import { Metadata } from "next";
import SettingsPage from "./SettingsPage";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Page() {
  const session = await auth();
  const user = session?.user;

  //if not logged in, redirect to signin page
  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/settings");
  }

  return <SettingsPage user={user} />;
}
