"use client";

import TableTemplate, {
  ListItem,
  ListItemLink,
} from "@/components/templates/TableTemplate";
import { GroupLine } from "@/generate/prisma";
import { deleteGroupLine } from "../actions";
import { Button } from "react-bootstrap";

function GroupAccessList({ groupLines }: { groupLines: GroupLine[] | null }) {
  const handleDeleteRecord = async (id: string | null) => {
    if (!id) return;

    await deleteGroupLine({ id });
  };
  return (
    <TableTemplate>
      <TableTemplate.Header>
        <TableTemplate.Column name="entityName">modelo</TableTemplate.Column>
        <TableTemplate.Column name="fieldName">Campo</TableTemplate.Column>
        <TableTemplate.Column name="notCreate">no crear</TableTemplate.Column>
        <TableTemplate.Column name="noEdit">no editar</TableTemplate.Column>
        <TableTemplate.Column name="invisible">Oculto</TableTemplate.Column>
        <TableTemplate.Column name="required">requerido</TableTemplate.Column>
        <TableTemplate.Column name="readonly">
          solo lectura
        </TableTemplate.Column>
        <TableTemplate.Column name="deleteButton" className="text-center">
          <i className="bi bi-trash3"></i>
        </TableTemplate.Column>
      </TableTemplate.Header>
      <TableTemplate.Content>
        {groupLines?.map((line) => (
          <ListItemLink key={line.id} path="#">
            <ListItem name="entityName">{line.entityName}</ListItem>
            <ListItem name="fieldName">{line.fieldName}</ListItem>
            <ListItem name="notCreate" className="text-center">
              {line.notCreate ? "Sí" : "No"}
            </ListItem>
            <ListItem name="noEdit" className="text-center">
              {line.noEdit ? "Sí" : "No"}
            </ListItem>
            <ListItem name="invisible" className="text-center">
              {line.invisible ? "Sí" : "No"}
            </ListItem>
            <ListItem name="required" className="text-center">
              {line.required ? "Sí" : "No"}
            </ListItem>
            <ListItem name="readonly" className="text-center">
              {line.readonly ? "Sí" : "No"}
            </ListItem>
            <ListItem name="deleteButton" className="text-center">
              <Button
                variant="link"
                onClick={() => handleDeleteRecord(line.id)}
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

export default GroupAccessList;
