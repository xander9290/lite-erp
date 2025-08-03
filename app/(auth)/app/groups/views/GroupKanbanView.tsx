"use client";

import KanbanContainer from "@/ui/KanbanContainer";
import { Container, Row } from "react-bootstrap";
import { GroupWithAttrs } from "../actions";

function GroupKanbanView({ groups }: { groups: GroupWithAttrs[] | null }) {
  return (
    <Container fluid>
      <Row className="g-2 py-2">
        {groups?.map((group) => (
          <KanbanContainer
            key={group.id}
            formView={`/app/groups?view_mode=form&id=${group.id}`}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="card-title fw-bold">{group.name}</h5>
              <h6>
                <strong>Usuarios: </strong>
                {group.users.length}
              </h6>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <p className="card-text mb-0">
                <strong>Creado por: </strong>
                {group.createBy ? group.createBy.name : "Desconocido"}
              </p>
              <p className="card-text mb-0">
                <strong>Accesos: </strong>
                {group.groupLines.length}
              </p>
            </div>
          </KanbanContainer>
        ))}
      </Row>
    </Container>
  );
}

export default GroupKanbanView;
