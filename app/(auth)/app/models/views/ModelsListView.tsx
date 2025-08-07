"use client";

import ListTemplate from "@/components/templates/ListTemplate";
import { ModelsWithAttrs } from "../actions";

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
  return (
    <ListTemplate
      page={page}
      perPage={perPage}
      total={total}
      title="Modelos"
      viewForm="/app/models?view_mode=form&id=null"
      basePath="/app/models?view_mode=list&page=1"
      filterSearch={[{ key: "name", value: "Nombre" }]}
    >
      <h2>Alguna vista:{page}</h2>
    </ListTemplate>
  );
}

export default ModelsListView;
