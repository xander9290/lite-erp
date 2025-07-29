import { Suspense } from "react";
import ProfileMainView from "./views/ProfileMainView";
import LoadingPage from "@/app/LoadingPage";

async function PageProfile({
  params,
  searchParams,
}: {
  params: Promise<{ id: string | null }>;
  searchParams: Promise<{ [key: string]: string | null }>;
}) {
  const { id } = await params;
  const { view_type: viewType } = await searchParams;
  return (
    <Suspense fallback={<LoadingPage />}>
      <ProfileMainView modelId={id} viewType={viewType} />
    </Suspense>
  );
}

export default PageProfile;
