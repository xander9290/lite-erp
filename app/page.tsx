import LandingPage from "./LandingPage";
import { auth } from "@/libs/auth";
import { redirect } from "next/navigation";

async function PageHome() {
  const session = await auth();

  if (session?.user) {
    redirect("/app");
  }
  return <LandingPage />;
}

export default PageHome;
