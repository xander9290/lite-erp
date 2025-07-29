"use server";

import { fetchUsers } from "../actions";

async function UsersMainView({
  viewMode,
  page,
  search = "",
}: {
  viewMode: string;
  page: string;
  search: string;
}) {
  const skip: number = parseInt(page) || 1;
  const perPage = 50;

  const res = await fetchUsers({ skip, search, perPage });
  console.log(res.data);

  return <div>UsersMainView</div>;
}

export default UsersMainView;
