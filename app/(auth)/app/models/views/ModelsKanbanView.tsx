"use client";

import { Badge, Container, Row } from "react-bootstrap";
import { ModelsWithAttrs } from "../actions";
import KanbanContainer from "@/ui/KanbanContainer";

function ModelsKanbanView({ models }: { models: ModelsWithAttrs[] | null }) {
  return (
    <Container fluid>
      <Row className="g-2 py-2">
        {models?.map((model) => (
          <KanbanContainer
            key={model.id}
            formView={`/app/models?view_mode=form&id=${model.id}`}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="card-title fw-bold">{model.displayName}</h5>
              {!model.active && <Badge bg="danger">Inactivo</Badge>}
              <p className="card-text">
                Campos: {model.fieldLines.length || 0}
              </p>
            </div>
          </KanbanContainer>
        ))}
      </Row>
    </Container>
  );
}

export default ModelsKanbanView;
