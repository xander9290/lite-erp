import NotFound from "@/app/not-found";
import { fetchGroups, fetchGroup } from "../actions";
import GroupFormView from "./GroupFormView";
import GroupListView from "./GroupListView";
import { userMany2one } from "../../users/actions";

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
  const skip: number = parseInt(page) || 1;
  const perPage = 50;
  // HACE FETCH DE GRUPOS
  const res = await fetchGroups({
    filter,
    search,
    skip,
    perPage: 10,
  });

  if (!res.success) {
    return <div>Error al cargar grupos: {res.message}</div>;
  }
  const groups = res.data || [];

  // Si se proporciona un ID, busca el grupo específico
  let group = null;
  if (id && id !== "null") {
    const groupRes = await fetchGroup(id);
    if (!groupRes.success) {
      return <div>Error al cargar el grupo: {groupRes.message}</div>;
    }
    group = groupRes.data;
  }

  const usersMany2one = await userMany2one({
    domain: ["and", ["groupId", "=", null], ["active", "=", true]],
  });

  if (viewMode === "list") {
    return (
      <GroupListView
        page={skip}
        perPage={perPage}
        total={groups.length}
        groups={groups}
        filter={filter}
      />
    );
  } else if (viewMode === "form") {
    return (
      <GroupFormView
        modelId={id}
        group={group || null}
        usersMany2one={usersMany2one.data || []}
      />
    );
  } else {
    return <NotFound />; // Si el modo de vista no es válido, muestra una página 404
  }
}

export default MainGroupView;
