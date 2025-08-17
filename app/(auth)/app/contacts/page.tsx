import LoadingPage from "@/app/LoadingPage";
import { lazy, Suspense } from "react";

const ContactsViewMain = lazy(() => import("./views/ContactsViewMain"));

async function PageContacts({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const {
    view_mode: viewMode,
    page,
    search,
    filter,
    type: displayType,
    id,
  } = await searchParams;

  return (
    <Suspense fallback={<LoadingPage />}>
      <ContactsViewMain
        viewMode={viewMode}
        search={search}
        page={page}
        filter={filter}
        displayType={displayType}
        id={id}
      />
    </Suspense>
  );
}

export default PageContacts;
