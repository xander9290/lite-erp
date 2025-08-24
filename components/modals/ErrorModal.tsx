"react";

import { ModalBasicProps } from "@/libs/definitions";
import { Button, Modal } from "react-bootstrap";

function ErrorModal({ show, onHide, string }: ModalBasicProps) {
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
          <i className="bi bi-exclamation-triangle text-warning me-2"></i>
          Error de validación
        </Modal.Title>
        <p>{string}</p>
        <Button variant="dark" size="sm" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default ErrorModal;
