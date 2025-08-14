"use client";

import ListTemplate from "@/components/templates/ListTemplate";
import TableTemplate, {
  ListItem,
  ListItemLink,
} from "@/components/templates/TableTemplate";
import { useAccess } from "@/context/AccessContext";
import { UserWithPartner } from "@/libs/definitions";
import { formatDate } from "@/libs/helpers";
import ImageAvatar from "@/ui/ImageAvatar";
import { Badge } from "react-bootstrap";

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
  const access = useAccess("app");
  const isAllowed = access.find(
    (field) => field.fieldName === "settingsUsersMenu"
  );

  if (isAllowed && isAllowed?.invisible)
    return <h2 className="text-center">🚫 VISTA NO PERMITIDA</h2>;
  return (
    <ListTemplate
      page={page}
      perPage={perPage}
      total={total}
      title="Usuarios"
      viewForm="/app/users?view_mode=form&id=null"
      basePath="/app/users?view_mode=list&page=1"
      filterSearch={[
        { key: "displayName", value: "Nombre" },
        { key: "partner.name", value: "Contacto" },
        { key: "group.name", value: "Grupo" },
      ]}
    >
      <TableTemplate>
        <TableTemplate.Header sticky={true}>
          <TableTemplate.Column name="name">nombre</TableTemplate.Column>
          <TableTemplate.Column name="login">usuario</TableTemplate.Column>
          <TableTemplate.Column name="login">activo</TableTemplate.Column>
          <TableTemplate.Column name="groupId">Grupo</TableTemplate.Column>
          <TableTemplate.Column name="lastLogin">
            última conexion
          </TableTemplate.Column>
          <TableTemplate.Column name="state">estado</TableTemplate.Column>
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
              <ListItem name="partner.name">
                <div className="d-flex gap-2 align-items-center">
                  <ImageAvatar imageUrl={user.partner?.Image?.url || null} />
                  {user.partner?.name}
                </div>
              </ListItem>
              <ListItem name="login">{user.login}</ListItem>
              <ListItem name="active" className="text-center">
                {user.active ? (
                  <Badge pill bg="success">
                    Activo
                  </Badge>
                ) : (
                  <Badge pill bg="danger">
                    Inactivo
                  </Badge>
                )}
              </ListItem>
              <ListItem name="groupId">
                {!!user.group ? user.group.name : "no asigando"}
              </ListItem>
              <ListItem name="lastLogin">
                {formatDate(user.lastLogin || null) || "no conectado"}
              </ListItem>
              <ListItem name="state" className="text-center">
                {user.state === "not_confirmed" ? (
                  <Badge pill bg="warning">
                    Sin confirmar
                  </Badge>
                ) : (
                  <Badge pill bg="info">
                    Confirmado
                  </Badge>
                )}
              </ListItem>
              <ListItem name="createdAt">
                {formatDate(user.createdAt || null)}
              </ListItem>
              <ListItem name="createdBy">
                {user.partner?.createBy?.name || "bot"}
              </ListItem>
            </ListItemLink>
          ))}
        </TableTemplate.Content>
      </TableTemplate>
    </ListTemplate>
  );
}

export default UserListView;
