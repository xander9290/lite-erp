"use client";
import NotFound from "@/app/not-found";
import { fetchUser, fetchUsers } from "../actions";
import UserListView from "./UserListView";
import { UserWithPartner } from "@/libs/definitions";
import UserFormView from "./UserFormView";
import { db } from "@/libs/core/db/ExtendedPrisma";
import { useAppLayout } from "@/contexts/LayoutContext";
import { useEffect, useState } from "react";
import { GroupWithAttrs } from "../../groups/actions";

async function UsersMainView() {
  const { filter, skip, search, id, viewMode } = useAppLayout();
  const perPage = 50;

  const [users, setUsers] = useState<UserWithPartner[]>([]);
  const [user, setUser] = useState<UserWithPartner | null>(null);
  const [groups, setGroups] = useState<GroupWithAttrs[]>([]);

  useEffect(() => {
    const handleAll = async () => {
      const res = await fetchUsers({
        skip,
        search: search || "",
        perPage,
        filter: filter || "name",
      });
      setUsers(res.data || []);

      const resUser = await fetchUser({ id });
      setUser(resUser.data || null);

      const groups = await db.find("group", ["or", ["name", "ilike", ""]], {
        take: 8,
        orderBy: { name: "asc" },
      });
      setGroups(groups || []);
    };
    handleAll();
  }, []);

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
