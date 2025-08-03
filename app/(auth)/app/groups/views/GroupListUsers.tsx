"use client";

import TableTemplate, {
  ListItem,
  ListItemLink,
} from "@/components/templates/TableTemplate";
import { User } from "@/generate/prisma";

function GroupListUsers({ users }: { users: User[] }) {
  return (
    <TableTemplate>
      <TableTemplate.Header sticky={false}>
        <TableTemplate.Column name="name">nombre</TableTemplate.Column>
        <TableTemplate.Column name="login">usuario</TableTemplate.Column>
      </TableTemplate.Header>
      <TableTemplate.Content>
        {users.map((user) => (
          <ListItemLink
            key={user.id}
            path={`/app/users?view_mode=form&id=${user.id}`}
          >
            <ListItem name="name">{user.name}</ListItem>
            <ListItem name="login">{user.login}</ListItem>
          </ListItemLink>
        ))}
      </TableTemplate.Content>
    </TableTemplate>
  );
}

export default GroupListUsers;
