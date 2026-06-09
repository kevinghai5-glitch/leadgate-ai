import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LandingClient from "./landing-client";

export default async function Page() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  const jar = await cookies();
  if (jar.get("lg_returning")?.value === "1") {
    redirect("/login");
  }
  return <LandingClient />;
}
