"use client";

import TableTemplate, {
  ListItem,
  ListItemLink,
} from "@/components/templates/TableTemplate";
import { ModelFieldLine } from "@/generate/prisma";
import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
import { deleteField } from "../actions";

function ModelsFieldList({
  fieldLines,
  path,
}: {
  fieldLines: ModelFieldLine[];
  path: string;
}) {
  const route = useRouter();

  const handleEdit = (activeId: string) => {
    route.replace(`${path}&active_id=${activeId}`);
  };

  const handleDelete = async (id: string | null) => {
    if (!id) return;
    await deleteField({ id });
  };

  return (
    <TableTemplate>
      <TableTemplate.Header sticky={false}>
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
        <TableTemplate.Column name="edit" className="text-center">
          <i className="bi bi-pencil-square"></i>
        </TableTemplate.Column>
        <TableTemplate.Column name="deltete" className="text-center">
          <i className="bi bi-trash3"></i>
        </TableTemplate.Column>
      </TableTemplate.Header>
      <TableTemplate.Content>
        {fieldLines.map((field, i) => (
          <ListItemLink key={field.id} path="#">
            <ListItem name="#">{i + 1}</ListItem>
            <ListItem name="name">{field.name}</ListItem>
            <ListItem name="label">{field.label}</ListItem>
            <ListItem name="displayName">{field.displayName}</ListItem>
            <ListItem name="type">{field.type}</ListItem>
            <ListItem name="required">{field.required ? "Sí" : "No"}</ListItem>
            <ListItem name="edit" className="text-center">
              <Button
                size="sm"
                type="button"
                variant="link"
                onClick={() => handleEdit(field.id)}
              >
                <i className="bi bi-pencil-square"></i>
              </Button>
            </ListItem>
            <ListItem name="delete" className="text-center">
              <Button
                size="sm"
                type="button"
                variant="link"
                onClick={() => handleDelete(field.id)}
              >
                <i className="bi bi-trash3 text-danger"></i>
              </Button>
            </ListItem>
          </ListItemLink>
        ))}
      </TableTemplate.Content>
    </TableTemplate>
  );
}

export default ModelsFieldList;
