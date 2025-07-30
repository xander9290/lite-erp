"use client";

import FormTemplate from "@/components/templates/FormTemplate";
import { UserWithPartner } from "@/libs/definitions";

function UserFormView({ user }: { user: UserWithPartner | null }) {
  return <FormTemplate></FormTemplate>;
}

export default UserFormView;
