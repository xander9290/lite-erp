import LoadingPage from "@/app/LoadingPage";
import { lazy, Suspense } from "react";

const FieldsMainView = lazy(() => import("./views/FieldsMainView"));

async function PageFields({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { view_mode: viewMode, page, search, filter } = await searchParams;
  return (
    <Suspense fallback={<LoadingPage />}>
      <FieldsMainView
        filter={filter}
        viewMode={viewMode}
        page={page}
        search={search}
      />
    </Suspense>
  );
}

export default PageFields;
