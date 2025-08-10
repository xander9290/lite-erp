import ModelsListView from "./ModelsListView";
import ModelsFormView from "./ModelsFormView";
import { readModel, readModels } from "../actions";
import NotFound from "@/app/not-found";
import { db } from "@/libs/core/db/ExtendedPrisma";

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

  const [models, total] = await Promise.all([
    await readModels({
      filter: filter || "name",
      perPage,
      search: search || "",
      skip,
    }),

    await db.find("model", ["or", [filter, "ilike", search]]),
  ]);

  // const models = resModels.data || [];

  const resModel = await readModel({ id });

  const model = resModel.data || null;

  if (viewMode === "list") {
    return (
      <ModelsListView
        filter={filter || ""}
        page={skip}
        perPage={perPage}
        total={total.length}
        models={models.data || []}
      />
    );
  } else if (viewMode === "form") {
    return <ModelsFormView modelId={id} model={model} />;
  } else {
    return <NotFound />;
  }
}

export default ModelsMainView;
