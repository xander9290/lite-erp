import LoadingPage from "@/app/LoadingPage";
import { Suspense } from "react";
import UsersMainView from "./views/UsersMainView";

async function PageUsers({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { view_mode: viewMode, page, search, filter, id } = await searchParams;
  return (
    <Suspense fallback={<LoadingPage />}>
      <UsersMainView
        viewMode={viewMode}
        page={page}
        search={search}
        filter={filter}
        id={id}
      />
    </Suspense>
  );
}

export default PageUsers;
