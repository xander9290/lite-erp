"use client";

import ListTemplate from "@/components/templates/ListTemplate";
import { GroupWithAttrs } from "../actions";
import GroupKanbanView from "./GroupKanbanView";

function GroupListView({
  page,
  perPage,
  total,
  groups,
}: {
  page: number;
  perPage: number;
  total: number;
  filter: string;
  groups: GroupWithAttrs[] | null;
}) {
  return (
    <ListTemplate
      page={page}
      perPage={perPage}
      total={total}
      title="Grupos"
      viewForm="/app/groups?view_mode=form&id=null"
      basePath="/app/groups?view_mode=list&page=1"
      filterSearch={[
        { key: "name", value: "Nombre" },
        { key: "createBy.name", value: "Creado por" },
      ]}
    >
      <GroupKanbanView groups={groups} />
    </ListTemplate>
  );
}

export default GroupListView;
