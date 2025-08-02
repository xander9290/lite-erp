import LandingPage from "./LandingPage";
import { auth } from "@/libs/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

async function PageHome() {
  const session = await auth();

  const hashed = await bcrypt.hash("1234", 10);
  console.log(hashed);

  if (session?.user) {
    redirect("/app");
  }
  return <LandingPage />;
}

export default PageHome;
