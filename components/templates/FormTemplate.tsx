"use client";

import { useAccess } from "@/context/AccessContext";
import { ModalBasicProps } from "@/libs/definitions";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, lazy, CSSProperties } from "react";

import {
  Alert,
  Button,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  ListGroup,
  Modal,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";

const ActivityTemplate = lazy(() => import("./ActivityTemplate"));

type FormViewTemplateProps = {
  children: React.ReactNode;
  viewForm: string;
  formActions?: TFormActions[];
  formStates?: TFormState[];
  state?: string;
  name?: string;
  disableForm?: boolean;
  onSubmit: React.MouseEventHandler<HTMLButtonElement>;
  isDirty: boolean;
  revert: () => void;
  notCreate?: boolean;
  withActivity?: boolean;
  entityName: string;
  active?: boolean;
};

type TFormActions = {
  string: string;
  action: () => void;
  confirm?: string;
  invisible?: boolean;
  disable?: boolean;
  name: string;
};

export type TFormState = {
  name: string;
  label: string;
};

function FormTemplate({
  children,
  viewForm,
  formActions,
  formStates,
  state,
  name,
  disableForm,
  onSubmit,
  isDirty,
  revert,
  notCreate,
  withActivity,
  entityName,
  active,
}: FormViewTemplateProps) {
  const access = useAccess(entityName);

  const searchParams = useSearchParams();
  const model_id = searchParams.get("id");

  const router = useRouter();

  const [modalConfirmFormAction, setModalConfirmFormAction] =
    useState<ModalBasicProps>({
      show: false,
      action: undefined,
      string: undefined,
    });

  const handleActionForm = (action: () => void, confirm?: string) => {
    if (confirm) {
      setModalConfirmFormAction({ show: true, action, string: confirm });
    } else {
      action();
    }
  };

  const not_create =
    access.filter((attr) => attr.notCreate === true)[0]?.notCreate || false;
  const no_edit =
    access.filter((attr) => attr.noEdit === true)[0]?.noEdit || false;

  console.table({ no_edit, not_create });

  return (
    <Row className="h-100 overflow-auto">
      <Col xs="12" md="8" className="h-100">
        <Form className="card d-flex flex-column shadow h-100">
          <fieldset
            className="card-header d-flex justify-content-between"
            disabled={disableForm}
          >
            <div className="d-flex align-items-center gap-2">
              {model_id === "null" ? null : (
                <span
                  style={{
                    display: not_create ? "none" : "inline-block",
                  }}
                >
                  <Button
                    variant="primary"
                    className="fw-bold"
                    onClick={() => router.replace(viewForm)}
                    style={{ display: notCreate ? "none" : "inline-block" }}
                  >
                    Nuevo
                  </Button>
                </span>
              )}
              <Button
                variant="secondary"
                type="button"
                title="Guardar"
                disabled={!isDirty}
                style={{
                  display: no_edit ? "none" : "inline-block",
                }}
                onClick={onSubmit}
              >
                {disableForm ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <i className="bi bi-cloud-arrow-up-fill"></i>
                )}
              </Button>
              <Button
                variant="secondary"
                type="button"
                title="Deshacer"
                disabled={!isDirty}
                onClick={revert}
                style={{
                  display: no_edit ? "none" : "inline-block",
                }}
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </Button>
            </div>
            <div className="d-flex gap-2">
              {/* Desktop buttons */}
              <div className="d-none d-md-flex gap-2">
                {formActions?.map((action, i) => {
                  const fieldAccessAttrs = access?.find(
                    (field) => field.fieldName === action.name
                  );
                  const styleProps: CSSProperties = {
                    display: fieldAccessAttrs?.invisible ? "none" : "block",
                    pointerEvents: fieldAccessAttrs?.readonly ? "none" : "auto",
                  };
                  return (
                    <div
                      style={styleProps}
                      key={`form-action-${i}-${action.string}`}
                    >
                      <Button
                        variant="dark"
                        onClick={() =>
                          handleActionForm(action.action, action.confirm)
                        }
                        style={{
                          display: action.invisible ? "none" : "inline-block",
                        }}
                        disabled={action.disable}
                        title={action.name}
                        type="button"
                      >
                        {action.string}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Mobile dropdown */}
              {formActions && (
                <div className="d-flex d-md-none">
                  <DropdownButton variant="dark" title="Acciones" align="end">
                    {formActions
                      ?.filter((action) => !action.invisible)
                      .map((action, i) => {
                        const fieldAccessAttrs = access?.find(
                          (field) => field.fieldName === action.name
                        );
                        const styleProps: CSSProperties = {
                          display: fieldAccessAttrs?.invisible
                            ? "none"
                            : "block",
                          pointerEvents: fieldAccessAttrs?.readonly
                            ? "none"
                            : "auto",
                        };
                        return (
                          <span
                            style={styleProps}
                            key={`form-action-dropdown-${i}-${action.string}`}
                          >
                            <Dropdown.Item
                              as="button"
                              type="button"
                              onClick={() =>
                                handleActionForm(action.action, action.confirm)
                              }
                              disabled={action.disable}
                              title={action.name}
                            >
                              {action.string}
                            </Dropdown.Item>
                          </span>
                        );
                      })}
                  </DropdownButton>
                </div>
              )}
            </div>
            <Button
              onClick={() => router.back()}
              variant="primary"
              title="Regresar"
            >
              <i className="bi bi-arrow-left"></i>
            </Button>
          </fieldset>
          <fieldset
            className="card-body  flex-fill overflow-auto"
            disabled={disableForm}
          >
            {active === true ? null : (
              <Alert variant="warning" className="py-1">
                <p className="fs-2 my-1 text-center">INACTIVO</p>
              </Alert>
            )}
            <div className="d-flex justify-content-between align-items-end mb-2">
              <h2 className="card-title fw-bolder">{name ?? "Nuevo"}</h2>
              {/* STATEBAR - Desktop */}
              <ListGroup horizontal className="d-none d-md-flex">
                {formStates?.map((st, i) => (
                  <ListGroup.Item
                    key={`form-states-${i}-${st.label}`}
                    className="border fw-bolder text-uppercase opacity"
                    active={st.name === state ? true : false}
                    variant="secondary"
                  >
                    {st.label || "estado"}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              {/* STATEBAR - Mobile (Dropdown) */}
              {formStates && (
                <div className="d-flex d-md-none">
                  <ListGroup>
                    <ListGroup.Item
                      variant="warning"
                      className="border fw-bolder text-uppercase"
                    >
                      {formStates?.find((st) => st.name === state)?.label ||
                        "estado"}
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              )}
            </div>
            <div className="container p-0">
              <Row className="gy-2">{children}</Row>
            </div>
          </fieldset>
        </Form>
      </Col>
      <Col xs="12" md="4" className="h-100">
        <Suspense fallback={<Spinner animation="border" size="sm" />}>
          {withActivity && (
            <ActivityTemplate entityId={model_id} entityName={entityName} />
          )}
        </Suspense>
      </Col>
      <ModalActionConfirm
        show={modalConfirmFormAction.show}
        onHide={() =>
          setModalConfirmFormAction({ show: false, action: undefined })
        }
        action={modalConfirmFormAction.action}
        string={modalConfirmFormAction.string}
      />
    </Row>
  );
}

export const ViewGroup = ({
  children,
  title,
  disabled,
}: {
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
}) => {
  return (
    <Col xs="12" sm="6" md="6" lg="6" xl="6" xxl="6">
      <fieldset className="p-3 bg-body-tertiary rounded" disabled={disabled}>
        <legend className="fs-4">{title}</legend>
        {children}
      </fieldset>
    </Col>
  );
};

export const ViewGroupStack = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`d-flex justify-content-between ${className}`}>
      {children}
    </div>
  );
};

export const ViewGroupFluid = ({
  children,
  classname,
}: {
  children: React.ReactNode;
  classname?: string;
}) => {
  return (
    <Col xs="12" md="12" className="mt-2">
      <div className={`p-2 bg-body-tertiary rounded ${classname}`}>
        {children}
      </div>
    </Col>
  );
};

export const FormBook = ({
  children,
  dKey,
}: {
  children: React.ReactNode;
  dKey: string;
}) => {
  const [key, setKey] = useState(dKey);
  return (
    <ViewGroupFluid>
      <Tabs accessKey={key} onSelect={(k) => setKey(k || "")}>
        {children}
      </Tabs>
    </ViewGroupFluid>
  );
};

export const FormPage = ({
  children,
  eventKey,
  title,
}: {
  children: React.ReactNode;
  eventKey: string | undefined;
  title: string;
}) => {
  return (
    <Tab eventKey={eventKey} title={title}>
      {children}
    </Tab>
  );
};

const ModalActionConfirm = ({
  show,
  onHide,
  action,
  string,
}: {
  show: boolean;
  onHide: () => void;
  action?: () => void;
  string?: string;
}) => {
  const handleAccept = () => {
    if (action) {
      setTimeout(() => {
        action();
      }, 400);
    }
    onHide();
  };
  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <Modal.Header closeButton>Confirmar Acción</Modal.Header>
      <Modal.Body>{string ?? "¿Ejecutar acción?"}</Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="success" onClick={handleAccept}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormTemplate;
