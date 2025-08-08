"use client";

import TableTemplate, {
  ListItem,
  ListItemLink,
} from "@/components/templates/TableTemplate";
import { ModelFieldLine } from "@/generate/prisma";

function ModelsFieldList({ fieldLines }: { fieldLines: ModelFieldLine[] }) {
  return (
    <TableTemplate>
      <TableTemplate.Header sticky={false}>
        <TableTemplate.Column name="name">nombre</TableTemplate.Column>
        <TableTemplate.Column name="type">tipo</TableTemplate.Column>
        <TableTemplate.Column name="required">requrido</TableTemplate.Column>
      </TableTemplate.Header>
      <TableTemplate.Content>
        {fieldLines.map((field) => (
          <ListItemLink key={field.id} path="#">
            <ListItem name="name">{field.name}</ListItem>
            <ListItem name="type">{field.type}</ListItem>
            <ListItem name="required">{field.required ? "Sí" : "No"}</ListItem>
          </ListItemLink>
        ))}
      </TableTemplate.Content>
    </TableTemplate>
  );
}

export default ModelsFieldList;
