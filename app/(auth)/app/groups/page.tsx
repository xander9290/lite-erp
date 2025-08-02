import LoadingPage from "@/app/LoadingPage";
import { lazy, Suspense } from "react";

const MainGroupView = lazy(() => import("./views/MainGroupView"));

async function PageGroups({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { view_mode: viewMode, page, search, filter, id } = await searchParams;
  return (
    <Suspense fallback={<LoadingPage />}>
      <MainGroupView
        filter={filter}
        id={id}
        search={search}
        viewMode={viewMode}
        page={page}
      />
    </Suspense>
  );
}

export default PageGroups;
