import TopNav from "@/components/navigation/TopNav";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { ServerStatusBanner } from "@/ui/ServerStatusBanner";
import { SessionProvider } from "next-auth/react";

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <LayoutProvider>
        <ServerStatusBanner />
        <div className="d-flex flex-column vh-100">
          <TopNav />
          <main className="container-fluid flex-fill overflow-hidden">
            {children}
          </main>
        </div>
      </LayoutProvider>
    </SessionProvider>
  );
}

export default AppLayout;
