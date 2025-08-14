"use client";

import ListTemplate from "@/components/templates/ListTemplate";
import { ModelsWithAttrs } from "../actions";
import ModelsKanbanView from "./ModelsKanbanView";
import { useAccess } from "@/context/AccessContext";

function ModelsListView({
  page,
  perPage,
  total,
  models,
}: {
  page: number;
  perPage: number;
  total: number;
  filter: string;
  models: ModelsWithAttrs[] | null;
}) {
  const access = useAccess("app");
  const isAllowed = access.find(
    (field) => field.fieldName === "settingsModelsMenu"
  );

  if (isAllowed && isAllowed?.invisible)
    return <h2 className="text-center">🚫 VISTA NO PERMITIDA</h2>;
  return (
    <ListTemplate
      page={page}
      perPage={perPage}
      total={total}
      title="Modelos"
      viewForm="/app/models?view_mode=form&id=null"
      basePath="/app/models?view_mode=list&page=1"
      filterSearch={[{ key: "displayName", value: "Nombre" }]}
    >
      <ModelsKanbanView models={models} />
    </ListTemplate>
  );
}

export default ModelsListView;
