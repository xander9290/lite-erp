"use client";

import ListTemplate from "@/components/templates/ListTemplate";
import TableTemplate, {
  ListItem,
  ListItemLink,
} from "@/components/templates/TableTemplate";
import { Model, ModelFieldLine } from "@/generate/prisma";
import { Button } from "react-bootstrap";

export interface FieldsWithAttrs extends ModelFieldLine {
  model: Model | null;
}

function FieldsListView({
  page,
  perPage,
  total,
  fields,
}: {
  page: number;
  perPage: number;
  total: number;
  filter: string;
  fields: FieldsWithAttrs[] | null;
}) {
  return (
    <ListTemplate
      page={page}
      perPage={perPage}
      total={total}
      title="Campos"
      basePath="/app/fields?view_mode=list&page=1"
      filterSearch={[
        { key: "displayName", value: "Nombre" },
        { key: "label", value: "Etiqueta" },
        { key: "model.displayName", value: "Modelo" },
      ]}
    >
      <TableTemplate>
        <TableTemplate.Header sticky={true}>
          <TableTemplate.Column name="#" className="text-end">
            #
          </TableTemplate.Column>
          <TableTemplate.Column name="name">Campo</TableTemplate.Column>
          <TableTemplate.Column name="label">Etiqueta</TableTemplate.Column>
          <TableTemplate.Column name="displayName">
            Nombre en pantalla
          </TableTemplate.Column>
          <TableTemplate.Column name="type">tipo</TableTemplate.Column>
          <TableTemplate.Column name="required">requerido</TableTemplate.Column>
          <TableTemplate.Column name="model">modelo</TableTemplate.Column>
        </TableTemplate.Header>
        <TableTemplate.Content>
          {fields?.map((field, i) => (
            <ListItemLink key={field.id} path="#">
              <ListItem name="#">{i + 1}</ListItem>
              <ListItem name="name">{field.name}</ListItem>
              <ListItem name="label">{field.label}</ListItem>
              <ListItem name="displayName">{field.displayName}</ListItem>
              <ListItem name="type">{field.type}</ListItem>
              <ListItem name="required" className="text-center">
                {field.required ? "Sí" : "No"}
              </ListItem>
              <ListItem name="displayName">{field.model?.label}</ListItem>
            </ListItemLink>
          ))}
        </TableTemplate.Content>
      </TableTemplate>
    </ListTemplate>
  );
}

export default FieldsListView;
