import ModelsListView from "./ModelsListView";
import ModelsFormView from "./ModelsFormView";
import { readModel, readModels } from "../actions";
import NotFound from "@/app/not-found";

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

  const resModels = await readModels({
    filter: filter || "name",
    perPage,
    search: search || "",
    skip,
  });

  const models = resModels.data || [];

  const resModel = await readModel({ id });

  const model = resModel.data || null;

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
    return <ModelsFormView modelId={id} model={model} />;
  } else {
    return <NotFound />;
  }
}

export default ModelsMainView;
