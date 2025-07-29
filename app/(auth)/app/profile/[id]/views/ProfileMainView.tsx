"use server";
import NotFound from "@/app/not-found";
import { db } from "@/libs/core/db/ExtendedPrisma";
import ProfileFormView from "./ProfileFormView";
import { UserWithPartner } from "@/libs/definitions";

async function ProfileMainView({
  modelId,
  viewType,
}: {
  modelId: string | null;
  viewType: string | null;
}) {
  const res = await db.find("user", ["and", ["id", "=", modelId]], {
    include: { partner: true },
  });

  const user = res[0] as UserWithPartner;

  if (viewType === "form") {
    return <ProfileFormView user={user} />;
  } else {
    return <NotFound />;
  }
}

export default ProfileMainView;
