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
    <Col xs="12" sm="6" md="6" lg="4" xl="4" xxl="3">
      <Link
        href={formView}
        className="card text-decoration-none btn btn-light btn-sm shadow-sm"
      >
        <div className="card-body p-0">
          <div>{children}</div>
        </div>
      </Link>
    </Col>
  );
}

export default KanbanContainer;
