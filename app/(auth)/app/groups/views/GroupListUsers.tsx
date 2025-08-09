"use client";

import TableTemplate, {
  ListItem,
  ListItemLink,
} from "@/components/templates/TableTemplate";
import { User } from "@/generate/prisma";
import { Button } from "react-bootstrap";

function GroupListUsers({
  users,
  handelRemoveUser,
}: {
  users: User[];
  handelRemoveUser: (userId: string | null) => void;
}) {
  return (
    <TableTemplate>
      <TableTemplate.Header sticky={false}>
        <TableTemplate.Column name="#" className="text-end">
          #
        </TableTemplate.Column>
        <TableTemplate.Column name="name">nombre</TableTemplate.Column>
        <TableTemplate.Column name="login">usuario</TableTemplate.Column>
        <TableTemplate.Column name="removeUser">{""}</TableTemplate.Column>
      </TableTemplate.Header>
      <TableTemplate.Content>
        {users.map((user, i) => (
          <ListItemLink
            key={user.id}
            path={`/app/users?view_mode=form&id=${user.id}`}
          >
            <ListItem name="#">{i + 1}</ListItem>
            <ListItem name="name">{user.name}</ListItem>
            <ListItem name="login">{user.login}</ListItem>
            <ListItem name="removeUser">
              <Button
                variant="link"
                size="sm"
                onClick={() => handelRemoveUser(user.id)}
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

export default GroupListUsers;
