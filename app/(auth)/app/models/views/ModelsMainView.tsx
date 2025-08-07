"use client";
import NotFound from "@/app/not-found";
import { fetchModels, ModelsWithAttrs } from "../actions";
import ModelsListView from "./ModelsListView";
import { useAppLayout } from "@/contexts/LayoutContext";
import { useEffect, useState } from "react";

function ModelsMainView() {
  const { skip, search, filter, viewMode } = useAppLayout();
  const perPage = 50;

  const [models, setModels] = useState<ModelsWithAttrs[]>([]);
  console.log(search);

  useEffect(() => {
    const handleFetchModels = async () => {
      const res = await fetchModels({
        filter: filter || "name",
        perPage,
        search: search || "",
        skip,
      });

      setModels(res.data || []);
    };

    handleFetchModels();
  }, []);

  if (viewMode === "list") {
    return (
      <ModelsListView
        filter={filter || ""}
        page={skip}
        perPage={perPage}
        total={models.length}
        models={models}
      />
    );
  } else if (viewMode === "form") {
    return <h2>Form</h2>;
  } else {
    return <NotFound />;
  }
}

export default ModelsMainView;
