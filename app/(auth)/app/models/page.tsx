import { lazy } from "react";

const ModelsMainView = lazy(() => import("./views/ModelsMainView"));

async function PageModels() {
  return <ModelsMainView />;
}

export default PageModels;
