"use client";

import Link from "next/link";
import { Nav, NavDropdown } from "react-bootstrap";

function TopNavItems() {
  return (
    <Nav className="me-auto">
      {/* VENTAS */}
      <NavDropdown
        title={
          <>
            <i className="bi bi-graph-up me-1 text-warning"></i>
            <span>Ventas</span>
          </>
        }
      >
        <NavDropdown.Item>Cotizaciones</NavDropdown.Item>
      </NavDropdown>

      {/* COMPRAS */}
      <NavDropdown
        title={
          <>
            <i className="bi bi-cart-plus me-1 text-warning"></i>
            <span>Compras</span>
          </>
        }
      >
        <NavDropdown.Item>Cotizaciones</NavDropdown.Item>
      </NavDropdown>

      {/* FACTURACIÓN */}
      <NavDropdown
        title={
          <>
            <i className="bi bi-file-earmark-text me-1 text-warning"></i>
            <span>Facturación</span>
          </>
        }
      >
        <NavDropdown.Item>
          <i className="bi bi-person-vcard me-1 text-warning"></i>
          <span>Clietes</span>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <i className="bi bi-building me-1 text-warning"></i>
          <span>Proveedores</span>
        </NavDropdown.Item>
      </NavDropdown>

      {/* CONTACTOS */}
      <NavDropdown
        title={
          <>
            <i className="bi bi-journal-bookmark me-1 text-warning"></i>
            <span>Contactos</span>
          </>
        }
      >
        <NavDropdown.Item>
          <i className="bi bi-person-vcard me-1 text-warning"></i>
          <span>Clietes</span>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <i className="bi bi-building me-1 text-warning"></i>
          <span>Proveedores</span>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <i className="bi bi-person-bounding-box me-1 text-warning"></i>
          <span>Empleados</span>
        </NavDropdown.Item>
      </NavDropdown>

      {/* INVENTARIO */}
      <NavDropdown
        title={
          <>
            <i className="bi bi-table me-1 text-warning"></i>
            <span>Inventario</span>
          </>
        }
      >
        <NavDropdown.Item>
          <i className="bi bi-boxes me-1 text-warning"></i>
          <span>Productos</span>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <i className="bi bi-grid-1x2 me-1 text-warning"></i>
          <span>Almacenes</span>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <i className="bi bi-arrow-down-up me-1 text-warning"></i>
          <span>Movimientos</span>
        </NavDropdown.Item>
      </NavDropdown>

      {/* AJUSTES */}
      <NavDropdown
        title={
          <>
            <i className="bi bi-gear me-1 text-warning"></i>
            <span>Ajustes</span>
          </>
        }
      >
        <NavDropdown.Item as={Link} href={`/app/users?view_mode=list&page=1`}>
          <i className="bi bi-person me-1 text-warning"></i>
          <span>Usuarios</span>
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} href={`/app/groups?view_mode=list&page=1`}>
          <i className="bi bi-people me-1 text-warning"></i>
          <span>Grupos</span>
        </NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}

export default TopNavItems;
