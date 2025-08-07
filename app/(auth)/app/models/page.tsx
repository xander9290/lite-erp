import LoadingPage from "@/app/LoadingPage";
import { lazy, Suspense } from "react";

const ModelsMainView = lazy(() => import("./views/ModelsMainView"));

async function PageModels({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { view_mode: viewMode, page, search, filter, id } = await searchParams;

  return (
    <Suspense fallback={<LoadingPage />}>
      <ModelsMainView
        filter={filter}
        id={id}
        page={parseInt(page)}
        search={search}
        viewMode={viewMode}
      />
    </Suspense>
  );
}

export default PageModels;
