"use client";
import { Container, Nav, Navbar } from "react-bootstrap";
import NavRightView from "./NavRightView";
import TopNavItems from "./TopNavItems";

function TopNav() {
  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary border-bottom border-secondary"
      sticky="top"
    >
      <Container fluid>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <TopNavItems />
          <Nav>
            <NavRightView />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNav;
