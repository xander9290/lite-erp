import { lazy } from "react";

const UsersMainView = lazy(() => import("./views/UsersMainView"));

async function PageUsers() {
  return <UsersMainView />;
}

export default PageUsers;
