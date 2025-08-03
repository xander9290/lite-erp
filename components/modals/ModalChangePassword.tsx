"use client";

import { changeUserPassword } from "@/app/actions/user-actions";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";

export type TModalProps = {
  show: boolean;
  onHide: () => void;
  modelId: string | null;
};

type TInputs = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function ModalChangePassword({ show, onHide, modelId }: TModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setError,
    formState: { errors },
  } = useForm<TInputs>();

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    setLoading(true);
    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Las contraseñas no coinciden",
      });
      setLoading(false);
      return;
    }

    const newData = {
      ...data,
      modelId,
    };

    const res = await changeUserPassword(newData);

    if (!res.success) {
      setError("currentPassword", {
        type: "manual",
        message: res.message,
      });
      setFocus("currentPassword");
      setLoading(false);
      return;
    }

    signOut();
    setLoading(false);
  };

  const handleOnEntered = () => {
    setFocus("currentPassword");
  };

  const handleOnExited = () => {
    reset();
    setLoading(false);
  };

  return (
    <Modal
      onEntered={handleOnEntered}
      onExited={handleOnExited}
      animation
      keyboard={false}
      size="sm"
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Cambiar contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          style={{ pointerEvents: loading ? "none" : "auto" }}
        >
          <Form.Group className="mb-3" controlId="formBasicCurrentPassword">
            <Form.Label>Contraseña actual</Form.Label>
            <Form.Control
              {...register("currentPassword", {
                required: "Este campo es requerido",
                minLength: {
                  value: 4,
                  message: "La contraseña debe tener mínimo 4 caracteres",
                },
                maxLength: {
                  value: 8,
                  message: "La contraseña debe tener máximo 8 caracteres",
                },
              })}
              size="lg"
              type="password"
              className="text-center"
              isInvalid={!!errors.currentPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.currentPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Nueva contraseña</Form.Label>
            <Form.Control
              {...register("newPassword", {
                required: "Este campo es requerido",
                minLength: {
                  value: 4,
                  message: "La contraseña debe tener mínimo 4 caracteres",
                },
                maxLength: {
                  value: 8,
                  message: "La contraseña debe tener máximo 8 caracteres",
                },
              })}
              size="lg"
              type="password"
              className="text-center"
              isInvalid={!!errors.newPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.newPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control
              {...register("confirmPassword", {
                required: "Este campo es requerido",
                minLength: {
                  value: 4,
                  message: "La contraseña debe tener mínimo 4 caracteres",
                },
                maxLength: {
                  value: 8,
                  message: "La contraseña debe tener máximo 8 caracteres",
                },
              })}
              size="lg"
              type="password"
              className="text-center"
              isInvalid={!!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-grid gap-2">
            <Button type="submit">
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" />
                  <span className="ms-2">Cambiando...</span>
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ModalChangePassword;
