"use client";

import ListTemplate from "@/components/templates/ListTemplate";
import TableTemplate, {
  ListItem,
  ListItemLink,
} from "@/components/templates/TableTemplate";
import { UserWithPartner } from "@/libs/definitions";
import { formatDate } from "@/libs/helpers";
import ImageAvatar from "@/ui/ImageAvatar";
import Link from "next/link";
import { Dropdown, DropdownButton } from "react-bootstrap";

function UserListView({
  page,
  perPage,
  total,
  users,
}: {
  page: number;
  perPage: number;
  total: number;
  users: UserWithPartner[] | null;
}) {
  return (
    <ListTemplate
      page={page}
      perPage={perPage}
      total={total}
      title="Usuarios"
      viewForm="/app/users?view_mode=form&id=null"
      basePath="/app/users?view_mode=list&page=1"
      filterSearch={[
        { key: "nombre", value: "Nombre" },
        { key: "partner.name", value: "Contacto" },
      ]}
    >
      <TableTemplate>
        <TableTemplate.Header>
          <TableTemplate.Column name="options" className="text-center">
            <i className="bi bi-gear-fill"></i>
          </TableTemplate.Column>
          <TableTemplate.Column name="name">nombre</TableTemplate.Column>
          <TableTemplate.Column name="login">usuario</TableTemplate.Column>
          <TableTemplate.Column name="groupId">Grupo</TableTemplate.Column>
          <TableTemplate.Column name="lastLogin">
            última conexion
          </TableTemplate.Column>
          <TableTemplate.Column name="createdAt">
            creado el
          </TableTemplate.Column>
          <TableTemplate.Column name="createdUid">
            creado por
          </TableTemplate.Column>
        </TableTemplate.Header>
        <TableTemplate.Content>
          {users?.map((user) => (
            <ListItemLink
              key={user.id}
              path={`/app/users?view_mode=form&id=${user.id}`}
            >
              <ListItem name="userActios" className="text-center">
                <DropdownButton
                  variant="light"
                  size="sm"
                  title={<i className="bi bi-gear-fill"></i>}
                  className="p-0"
                >
                  <Dropdown.Item
                    as={Link}
                    href={`/app/users?view_mode=form&id=${user.id}`}
                  >
                    <i className="bi bi-pencil-square me-1"></i>
                    Editar
                  </Dropdown.Item>
                  <Dropdown.Item as={"button"}>
                    <i className="bi bi-archive-fill me-1"></i>
                    Archivar
                  </Dropdown.Item>
                  <Dropdown.Item as={"button"}>
                    <i className="bi bi-trash-fill me-1"></i>
                    Eliminar
                  </Dropdown.Item>
                </DropdownButton>
              </ListItem>
              <ListItem name="partner.name">
                <div className="d-flex gap-1 align-items-center">
                  <ImageAvatar imageUrl={user.partner.Image?.url || null} />
                  {user.partner.name}
                </div>
              </ListItem>
              <ListItem name="login">{user.login}</ListItem>
              <ListItem name="groupId">
                {!!user.group ? user.group.name : "sin grupo"}
              </ListItem>
              <ListItem name="lastLogin">
                {formatDate(user.lastLogin || null)}
              </ListItem>
              <ListItem name="createdAt">
                {formatDate(user.createdAt || null)}
              </ListItem>
              <ListItem name="createdBy">
                {user.partner.createdBy?.name || "N/A"}
              </ListItem>
            </ListItemLink>
          ))}
        </TableTemplate.Content>
      </TableTemplate>
    </ListTemplate>
  );
}

export default UserListView;
