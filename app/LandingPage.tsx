// app/page.tsx
"use client";

import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Link from "next/link";

export default function LandingPage() {
  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center"
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="text-center shadow-lg p-4">
            <Card.Body>
              <h1 className="mb-4">
                Bienvenido a <strong>LITE-ERP</strong>
              </h1>
              <div className="d-flex justify-content-center gap-3">
                <Link href="/api/auth/login" passHref>
                  <Button variant="primary">Iniciar sesión</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
