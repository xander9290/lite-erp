"use clienta";

import { ModalBasicProps } from "@/libs/definitions";
import { Button, Modal } from "react-bootstrap";

function AlertModal({ show, onHide, string, title }: ModalBasicProps) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      keyboard={false}
      backdrop="static"
      centered
      animation={false}
    >
      <Modal.Body>
        <Modal.Title className="fw-bold">
          <i className="bi bi-exclamation-circle me-2"></i>
          {title}
        </Modal.Title>
        <p>{string}</p>
        <Button variant="primary" size="sm" onClick={onHide}>
          Aceptar
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default AlertModal;
