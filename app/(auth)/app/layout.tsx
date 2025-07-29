import TopNav from "@/components/navigation/TopNav";
import { ServerStatusBanner } from "@/ui/ServerStatusBanner";
import { SessionProvider } from "next-auth/react";

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <ServerStatusBanner />
      <div className="d-flex flex-column vh-100">
        <TopNav />
        <main className="container-fluid flex-fill overflow-hidden">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}

export default AppLayout;
