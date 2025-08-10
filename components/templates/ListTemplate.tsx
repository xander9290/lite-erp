"use client";

import Pagination from "@/ui/Pagination";
import SearchHeader, { TFilterSearch } from "@/ui/SearchHeader";
import Link from "next/link";
import { Card, Col, Row } from "react-bootstrap";

type ListViewTemplateProps = {
  children: React.ReactNode;
  viewForm?: string;
  title: string;
  basePath: string;
  page: number;
  perPage: number;
  total: number;
  filterSearch: TFilterSearch[];
};

function ListTemplate({
  children,
  viewForm = "",
  title,
  basePath,
  page = 1,
  perPage = 50,
  total = 0,
  filterSearch,
}: ListViewTemplateProps) {
  return (
    <Card className="h-100 d-flex flex-column">
      <Card.Header>
        <Row className="g-2 align-items-end">
          <Col xs="12" md="3">
            <div className="d-flex align-items-center gap-2">
              {viewForm && (
                <Link className="btn btn-primary btn-sm" href={viewForm}>
                  Nuevo
                </Link>
              )}
              <Card.Title className="mb-0 text-capitalize">{title}</Card.Title>
            </div>
          </Col>
          <Col xs="12" sm="10" md="8" lg="7" xl="5" xxl="4">
            <SearchHeader basePath={basePath} filterSearch={filterSearch} />
          </Col>
          <Col xs="12" md="4" className="d-flex justify-content-end"></Col>
        </Row>
      </Card.Header>
      <Card.Body className="p-0 flex-fill overflow-auto">{children}</Card.Body>
      <Card.Footer className="p-1">
        <div className="d-flex justify-content-end">
          <Pagination
            total={total}
            page={page}
            perPage={perPage}
            basePath={basePath}
          />
        </div>
      </Card.Footer>
    </Card>
  );
}

export default ListTemplate;
