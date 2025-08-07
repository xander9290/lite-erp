"use client";

import { Button, Form, Modal } from "react-bootstrap";
import { TModalProps } from "./ModalChangePassword";
import { useForm, SubmitHandler } from "react-hook-form";
import { changePassword, createActivity } from "@/app/actions/user-actions";
import toast from "react-hot-toast";

type TInputs = {
  newPassword: string;
};

function ModalChangeUserPassword({ show, onHide, modelId }: TModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TInputs>();

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    if (!modelId) {
      setError("newPassword", {
        type: "manual",
        message: "ID NOT DEFINED",
      });
      setFocus("newPassword");
      return;
    }

    const newData = {
      newPassword: data.newPassword,
      modelId,
    };

    const res = await changePassword(newData);

    if (!res.success) {
      setError("newPassword", {
        type: "manual",
        message: res.message,
      });
      setFocus("newPassword");
      return;
    }

    await createActivity({
      entityId: modelId,
      entityName: "users",
      string: `Ha reestablecido la contraseña del usuario`,
    });

    toast.success(res.message, { position: "top-right" });

    onHide();
    reset();
  };

  const handleOnExited = () => {
    reset({ newPassword: "" });
  };

  return (
    <Modal
      onEnter={() => setFocus("newPassword")}
      onExited={handleOnExited}
      animation
      keyboard={false}
      size="sm"
      show={show}
      onHide={onHide}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">Restablecer contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          style={{ pointerEvents: isSubmitting ? "none" : "auto" }}
        >
          <Form.Group controlId="newPassword">
            <Form.Label>Nueva contraseña</Form.Label>
            <Form.Control
              type="password"
              {...register("newPassword", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 4,
                  message: "La contraseña debe tener al menos 4 caracteres",
                },
                maxLength: {
                  value: 8,
                  message: "La contraseña no puede exceder los 8 caracteres",
                },
              })}
              autoComplete="off"
              isInvalid={!!errors.newPassword}
              className="text-center"
            />
            {errors.newPassword && (
              <Form.Control.Feedback type="invalid">
                {errors.newPassword.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Button type="submit" variant="primary" className="mt-3">
            Aceptar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ModalChangeUserPassword;
