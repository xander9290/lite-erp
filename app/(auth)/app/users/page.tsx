import LoadingPage from "@/app/LoadingPage";
import { Suspense } from "react";
import UsersMainView from "./views/UsersMainView";

async function PageUsers({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { view_mode: viewMode, page, search, filter } = await searchParams;
  return (
    <Suspense fallback={<LoadingPage />}>
      <UsersMainView
        viewMode={viewMode}
        page={page}
        search={search}
        filter={filter}
      />
    </Suspense>
  );
}

export default PageUsers;
