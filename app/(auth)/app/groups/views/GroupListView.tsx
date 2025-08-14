"use client";

import ListTemplate from "@/components/templates/ListTemplate";
import { GroupWithAttrs } from "../actions";
import GroupKanbanView from "./GroupKanbanView";
import { useAccess } from "@/context/AccessContext";

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
  const access = useAccess("app");
  const isAllowed = access.find(
    (field) => field.fieldName === "settingsGroupsMenu"
  );

  if (isAllowed && isAllowed?.invisible)
    return <h2 className="text-center">🚫 VISTA NO PERMITIDA</h2>;
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
