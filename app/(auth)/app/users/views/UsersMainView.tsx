"use server";
import NotFound from "@/app/not-found";
import { fetchUser, fetchUsers } from "../actions";
import UserListView from "./UserListView";
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
  page: number;
  search: string;
  filter: string;
  id: string | null;
}) {
  const perPage = 50;
  const skip = page || 1;

  const resUsers = await fetchUsers({
    skip,
    search: search || "",
    perPage,
    filter: filter || "name",
  });

  const users = resUsers.data || [];

  const resUser = await fetchUser({ id });
  const user = resUser.data || null;

  const resGroups = await db.find("group", ["or", ["name", "ilike", ""]], {
    take: 8,
    orderBy: { name: "asc" },
  });

  const groups = resGroups;

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
