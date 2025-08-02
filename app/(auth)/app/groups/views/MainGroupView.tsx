"use server";

async function MainGroupView({
  viewMode,
  page,
  search = "",
  filter = "displayName",
  id,
}: {
  viewMode: string;
  page: string;
  search: string;
  filter: string;
  id: string | null;
}) {
  return <div>MainGroupView</div>;
}

export default MainGroupView;
