"use client";

import { useAccess } from "@/context/AccessContext";
import Link from "next/link";
import { Nav, NavDropdown } from "react-bootstrap";

function TopNavItems() {
  const access = useAccess("app");
  return (
    <Nav className="me-auto">
      {/* VENTAS */}
      <NavDropdown
        title={
          <>
            <i className="bi bi-graph-up me-1"></i>
            <span>Ventas</span>
          </>
        }
        disabled={
          access.find((field) => field.fieldName === "saleMenu")?.invisible
        }
      >
        <NavDropdown.Item>Cotizaciones</NavDropdown.Item>
      </NavDropdown>

      {/* COMPRAS */}
      <NavDropdown
        title={
          <>
            <i className="bi bi-cart-plus-fill me-1"></i>
            <span>Compras</span>
          </>
        }
        disabled={
          access.find((field) => field.fieldName === "purchaseMenu")?.invisible
        }
      >
        <NavDropdown.Item>Cotizaciones</NavDropdown.Item>
      </NavDropdown>

      {/* FACTURACIÓN */}
      <NavDropdown
        title={
          <>
            <i className="bi bi-file-earmark-text-fill me-1"></i>
            <span>Facturación</span>
          </>
        }
        disabled={
          access.find((field) => field.fieldName === "accountingMenu")
            ?.invisible
        }
      >
        <NavDropdown.Item>
          <i className="bi bi-person-vcard-fill me-1"></i>
          <span>Clietes</span>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <i className="bi bi-building me-1"></i>
          <span>Proveedores</span>
        </NavDropdown.Item>
      </NavDropdown>

      {/* CONTACTOS */}
      <NavDropdown
        title={
          <>
            <i className="bi bi-journal-bookmark-fill me-1"></i>
            <span>Contactos</span>
          </>
        }
        disabled={
          access.find((field) => field.fieldName === "partnerMenu")?.invisible
        }
      >
        <NavDropdown.Item
          as={Link}
          href={`/app/contacts?view_mode=list&page=1&type=customer`}
          disabled={
            access.find((field) => field.fieldName === "partnerMenuCustomer")
              ?.invisible
          }
        >
          <i className="bi bi-person-vcard-fill me-1"></i>
          <span>Clietes</span>
        </NavDropdown.Item>
        <NavDropdown.Item
          as={Link}
          href={`/app/contacts?view_mode=list&page=1&type=supplier`}
          disabled={
            access.find((field) => field.fieldName === "partnerMenuSupplier")
              ?.invisible
          }
        >
          <i className="bi bi-building me-1"></i>
          <span>Proveedores</span>
        </NavDropdown.Item>
        <NavDropdown.Item
          as={Link}
          href={`/app/contacts?view_mode=list&page=1&type=internal`}
          disabled={
            access.find((field) => field.fieldName === "partnerMenuInternal")
              ?.invisible
          }
        >
          <i className="bi bi-person-bounding-box me-1"></i>
          <span>Empleados</span>
        </NavDropdown.Item>
      </NavDropdown>

      {/* INVENTARIO */}
      <NavDropdown
        title={
          <>
            <i className="bi bi-table me-1"></i>
            <span>Inventario</span>
          </>
        }
        disabled={
          access.find((field) => field.fieldName === "inventoryMenu")?.invisible
        }
      >
        <NavDropdown.Item>
          <i className="bi bi-boxes me-1"></i>
          <span>Productos</span>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <i className="bi bi-grid-1x2-fill me-1"></i>
          <span>Almacenes</span>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <i className="bi bi-arrow-down-up me-1"></i>
          <span>Movimientos</span>
        </NavDropdown.Item>
      </NavDropdown>

      {/* AJUSTES */}
      <NavDropdown
        title={
          <>
            <i className="bi bi-gear-fill me-1"></i>
            <span>Ajustes</span>
          </>
        }
        disabled={
          access.find((field) => field.fieldName === "settingsMenu")?.invisible
        }
      >
        <NavDropdown.Item
          as={Link}
          href={`/app/users?view_mode=list&page=1`}
          disabled={
            access.find((field) => field.fieldName === "settingsUsersMenu")
              ?.invisible
          }
        >
          <i className="bi bi-person-fill me-1"></i>
          <span>Usuarios</span>
        </NavDropdown.Item>
        <NavDropdown.Item
          as={Link}
          href={`/app/groups?view_mode=list&page=1`}
          disabled={
            access.find((field) => field.fieldName === "settingsGroupsMenu")
              ?.invisible
          }
        >
          <i className="bi bi-people-fill me-1"></i>
          <span>Grupos</span>
        </NavDropdown.Item>
        <NavDropdown.Item
          as={Link}
          href={`/app/models?view_mode=list&page=1`}
          disabled={
            access.find((field) => field.fieldName === "settingsModelsMenu")
              ?.invisible
          }
        >
          <i className="bi bi-database-fill me-1"></i>
          <span>Modelos</span>
        </NavDropdown.Item>
        <NavDropdown.Item
          as={Link}
          href={`/app/fields?view_mode=list&page=1`}
          disabled={
            access.find((field) => field.fieldName === "settingsFieldsMenu")
              ?.invisible
          }
        >
          <i className="bi bi-list-columns-reverse me-1"></i>{" "}
          <span>Campos</span>
        </NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}

export default TopNavItems;
