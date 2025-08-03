"use server";
import NotFound from "@/app/not-found";
import { fetchUser, fetchUsers } from "../actions";
import UserListView from "./UserListView";
import { UserWithPartner } from "@/libs/definitions";
import UserFormView from "./UserFormView";
import { db } from "@/libs/core/db/ExtendedPrisma";

async function UsersMainView({
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

  const res = await fetchUsers({ skip, search, perPage, filter });

  const users: UserWithPartner[] = res.data || [];

  const resUser = await fetchUser({ id });

  const user = resUser.data || null;

  const groups = await db.find("group", ["or", ["name", "ilike", ""]], {
    take: 8,
    orderBy: { name: "asc" },
  });

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
    return <UserFormView modelId={id} user={user} groups={groups} />;
  } else {
    return <NotFound />;
  }
}

export default UsersMainView;
