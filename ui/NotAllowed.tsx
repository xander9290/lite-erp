"use client";

import { Container, Row, Col, Alert } from "react-bootstrap";

export default function VistaNoPermitida() {
  return (
    <Container fluid className="vh-100 d-flex mt-5 justify-content-center">
      <Row>
        <Col>
          <Alert variant="danger" className="text-center fs-3 fw-bold">
            VISTA NO PERMITIDA
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}
