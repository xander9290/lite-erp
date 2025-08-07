import NotFound from "@/app/not-found";
import { fetchModels } from "../actions";
import ModelsListView from "./ModelsListView";

async function ModelsMainView({
  viewMode,
  page,
  search = "",
  filter = "displayName",
  id,
}: {
  viewMode: string;
  page: number;
  search: string;
  filter: string;
  id: string | null;
}) {
  const perPage = 50;
  const skip = page || 1;

  const resModel = await fetchModels({
    filter: filter || "name",
    perPage,
    search: search || "",
    skip,
  });

  const models = resModel.data || [];

  if (viewMode === "list") {
    return (
      <ModelsListView
        filter={filter || ""}
        page={skip}
        perPage={perPage}
        total={models.length}
        models={models}
      />
    );
  } else if (viewMode === "form") {
    return <h2>Form</h2>;
  } else {
    return <NotFound />;
  }
}

export default ModelsMainView;
