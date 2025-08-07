import LoadingPage from "@/app/LoadingPage";
import { lazy, Suspense } from "react";

const UsersMainView = lazy(() => import("./views/UsersMainView"));

async function PageUsers({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { view_mode: viewMode, page, search, filter, id } = await searchParams;

  return (
    <Suspense fallback={<LoadingPage />}>
      <UsersMainView
        filter={filter}
        id={id}
        page={parseInt(page)}
        search={search}
        viewMode={viewMode}
      />
    </Suspense>
  );
}

export default PageUsers;
