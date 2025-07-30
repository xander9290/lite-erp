"use server";

import NotFound from "@/app/not-found";
import { fetchUsers } from "../actions";
import UserListView from "./UserListView";
import { UserWithPartner } from "@/libs/definitions";

async function UsersMainView({
  viewMode,
  page,
  search = "",
  filter = "displayName",
}: {
  viewMode: string;
  page: string;
  search: string;
  filter: string;
}) {
  const skip: number = parseInt(page) || 1;
  const perPage = 50;

  const res = await fetchUsers({ skip, search, perPage, filter });

  const users: UserWithPartner[] = res.data || [];

  if (viewMode === "list") {
    return (
      <UserListView
        users={users}
        page={skip}
        perPage={perPage}
        total={users.length}
      />
    );
  } else if (viewMode === "form") {
    return <h2>Formulario</h2>;
  } else {
    return <NotFound />;
  }
}

export default UsersMainView;
