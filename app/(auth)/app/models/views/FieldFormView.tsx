"use client";

import { Button, Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { createFieldLine, fetchField, updateField } from "../actions";
import { ModelFieldLine } from "@/generate/prisma";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type TInputs = {
  name: string;
  label: string;
  type: string;
  required: boolean;
};

function FieldFormView({
  modelId,
  getNewValue,
}: {
  modelId: string | null;
  getNewValue: (data: ModelFieldLine | undefined) => void;
}) {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setFocus,
  } = useForm<TInputs>();

  const searchParams = useSearchParams();
  const activeId = searchParams.get("active_id") || null;

  const route = useRouter();

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    if (!activeId || activeId === "null") {
      const res = await createFieldLine({ ...data, modelId });
      if (!res.success) {
        toast.error(res.message, { position: "top-right" });
        return;
      }
      reset({
        name: "",
        label: "",
        type: "",
        required: false,
      });
      getNewValue(res.data);
    } else {
      const newData = {
        ...data,
        id: activeId,
      };
      const res = await updateField(newData);
      if (!res.success) {
        toast.error(res.message, { position: "top-right" });
        return;
      }

      reset({
        name: "",
        label: "",
        type: "",
        required: false,
      });

      route.replace("/app/models?view_mode=form&id=" + modelId);
    }
  };

  const handleFetchField = async (activeId: string | null) => {
    if (!activeId) return;
    const res = await fetchField({ id: activeId });

    if (res.success) {
      reset({
        name: res.data?.name,
        label: res.data?.label,
        required: res.data?.required,
        type: res.data?.type,
      });
    }
  };

  useEffect(() => {
    if (activeId && activeId !== "null") {
      handleFetchField(activeId);
    }
  }, [activeId]);

  useEffect(() => {
    if (!isSubmitting) setFocus("name");
  }, [isSubmitting]);

  return (
    <fieldset disabled={isSubmitting}>
      <Form.Group
        controlId="FieldName"
        className="d-flex align-items-center flex-sm-nowrap flex-wrap gap-2 py-2"
      >
        <Form.Control
          {...register("name", { required: true })}
          size="sm"
          placeholder="Nombre"
          autoComplete="off"
          isInvalid={!!errors.name}
        />
        <Form.Control
          {...register("label", { required: true })}
          size="sm"
          placeholder="Etiqueta"
          autoComplete="off"
          isInvalid={!!errors.label}
        />
        <Form.Select size="sm" {...register("type", { required: true })}>
          <option value="">Tipo</option>
          <option value="text">Texto</option>
          <option value="number">Número</option>
          <option value="email">Correo</option>
          <option value="boolean">Booleano</option>
          <option value="date">Fecha</option>
          <option value="lines">Línea</option>
          <option value="related">Relación</option>
        </Form.Select>
        <Form.Check
          {...register("required")}
          label="Requerido"
          id="Requerido"
        />
        <Button type="button" size="sm" onClick={handleSubmit(onSubmit)}>
          <i className="bi bi-plus-circle"></i>
        </Button>
      </Form.Group>
    </fieldset>
  );
}

export default FieldFormView;
