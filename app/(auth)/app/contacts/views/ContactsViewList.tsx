"use client";

import ListTemplate from "@/components/templates/ListTemplate";
import { Image, Partner } from "@/generate/prisma";
import ContactsKanbanView from "./ContactsKanbanView";

export interface PartnerWithImage extends Partner {
  Image: Image | null;
}

export type DisplayTypes = {
  customer: string;
  supplier: string;
  internal: string;
};

const displayTypes: DisplayTypes = {
  customer: "Clientes",
  supplier: "Proveedores",
  internal: "Empleados",
};

function ContactsViewList({
  page,
  perPage,
  total,
  displayType,
  partners,
}: {
  page: number;
  perPage: number;
  total: number;
  filter: string;
  displayType: keyof DisplayTypes;
  partners: PartnerWithImage[] | null;
}) {
  return (
    <ListTemplate
      page={page}
      perPage={perPage}
      total={total}
      title={displayTypes[displayType]}
      viewForm={`/app/contacts?view_mode=form&id=null&type=${displayType}`}
      basePath={`/app/contacts?view_mode=list&page=1&type=${displayType}`}
      filterSearch={[
        { key: "displayName", value: "Nombre" },
        { key: "phone", value: "Teléfono" },
        { key: "street", value: "Calle" },
      ]}
    >
      <ContactsKanbanView partners={partners} />
    </ListTemplate>
  );
}

export default ContactsViewList;
