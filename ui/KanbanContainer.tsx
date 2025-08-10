"use client";

import Link from "next/link";
import { Col } from "react-bootstrap";

function KanbanContainer({
  children,
  formView,
}: {
  children: React.ReactNode;
  formView: string;
}) {
  return (
    <Col xs="12" sm="6" md="6" lg="4" xl="3" xxl="3">
      <Link
        href={formView}
        className="card text-decoration-none btn btn-light btn-sm shadow"
      >
        <div className="card-body p-2">{children}</div>
      </Link>
    </Col>
  );
}

export default KanbanContainer;
