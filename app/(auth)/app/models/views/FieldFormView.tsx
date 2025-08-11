"use client";

import { Button, Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { createFieldLine, fetchField, updateField } from "../actions";
import { ModelFieldLine } from "@/generate/prisma";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TableTemplate from "@/components/templates/TableTemplate";

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
    <TableTemplate>
      <TableTemplate.Header>
        <TableTemplate.Column name="name">
          <Form.Control
            {...register("name", { required: true })}
            size="sm"
            placeholder="Nombre"
            autoComplete="off"
            isInvalid={!!errors.name}
          />
        </TableTemplate.Column>
        <TableTemplate.Column name="label">
          <Form.Control
            {...register("label", { required: true })}
            size="sm"
            placeholder="Etiqueta"
            autoComplete="off"
            isInvalid={!!errors.label}
          />
        </TableTemplate.Column>
        <TableTemplate.Column name="type">
          <Form.Select size="sm" {...register("type", { required: true })}>
            <option value="">Tipo</option>
            <option value="text">Texto</option>
            <option value="number">Número</option>
            <option value="email">Correo</option>
            <option value="boolean">Booleano</option>
            <option value="date">Fecha</option>
            <option value="lines">Línea</option>
            <option value="related">Relación</option>
            <option value="page">Página</option>
            <option value="actionButton">Acción</option>
            <option value="menu">Menú</option>
          </Form.Select>
        </TableTemplate.Column>
        <TableTemplate.Column name="required">
          <Form.Check
            {...register("required")}
            label="Requerido"
            id="Requerido"
          />
        </TableTemplate.Column>
        <TableTemplate.Column name="btnSubmit">
          <Button type="button" size="sm" onClick={handleSubmit(onSubmit)}>
            <i className="bi bi-plus-circle"></i>
          </Button>
        </TableTemplate.Column>
      </TableTemplate.Header>
    </TableTemplate>
  );
}

export default FieldFormView;
