"use client";

import { ModalBasicProps } from "@/libs/definitions";
import { Button, Modal } from "react-bootstrap";

function ConfirmModal({ show, onHide, string, action }: ModalBasicProps) {
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
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-question-square me-2"></i>
          Confirmar la acción
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{string ?? "¿Ejecutar acción?"}</Modal.Body>
      <Modal.Footer>
        <Button size="sm" variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleAccept}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
