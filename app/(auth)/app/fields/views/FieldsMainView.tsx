import NotFound from "@/app/not-found";
import FieldsListView, { FieldsWithAttrs } from "./FieldsListView";
import { db } from "@/libs/core/db/ExtendedPrisma";
import { prisma } from "@/libs/prisma";

async function FieldsMainView({
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

  const [fields, total] = await Promise.all([
    await db.find("modelFieldLine", ["or", [filter, "ilike", search]], {
      include: {
        model: true,
      },
      skip: (skip - 1) * perPage,
      take: perPage,
      orderBy: { id: "asc" },
    }),

    await db.find("modelFieldLine", ["or", [filter, "ilike", search]]),
  ]);

  if (viewMode === "list") {
    return (
      <FieldsListView
        total={total.length}
        perPage={perPage}
        filter={filter}
        page={parseInt(page)}
        fields={fields || []}
      />
    );
  } else {
    return <NotFound />;
  }
}

export default FieldsMainView;
