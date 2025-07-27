import TopNav from "@/components/navigation/TopNav";

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="d-flex flex-column vh-100">
      <TopNav />
      <main className="container-fluid flex-fill overflow-hidden">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
