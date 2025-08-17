"use client";

import { Card, Container, Row } from "react-bootstrap";
import { PartnerWithImage } from "./ContactsViewList";
import KanbanContainer from "@/ui/KanbanContainer";

function ContactsKanbanView({
  partners,
}: {
  partners: PartnerWithImage[] | null;
}) {
  return (
    <Container fluid>
      <Row className="g-2 py-2">
        {partners?.map((partner) => (
          <KanbanContainer
            key={partner.id}
            formView={`/app/contacts?view_mode=form&id=${partner.id}&type=${partner.displayType}`}
          >
            <div className="d-flex gap-1" style={{ height: "125px" }}>
              <Card.Img
                src={partner.Image?.url ?? "/image/avatar_default.svg"}
                width={115}
                height={115}
                variant="string"
              />
              <div style={{ minWidth: "60%" }} className="text-start">
                <h6
                  title={partner.name}
                  className="card-title fw-bold text-truncate"
                >
                  {partner.name}
                </h6>
                <div style={{ fontSize: "0.8rem" }}>
                  <p className="card-text text-uppercase my-1">
                    {partner.street} {partner.town} {partner.province}{" "}
                    {partner.city}
                  </p>
                  {partner.phone && (
                    <p className="card-text my-1">{partner.phone}</p>
                  )}
                  {partner.email && (
                    <p className="card-text my-1">{partner.email}</p>
                  )}
                </div>
              </div>
            </div>
          </KanbanContainer>
        ))}
      </Row>
    </Container>
  );
}

export default ContactsKanbanView;
