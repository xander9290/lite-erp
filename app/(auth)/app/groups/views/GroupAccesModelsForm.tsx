"use client";

import { Button, Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { Many2one } from "@/ui/Many2one";
import { GroupLine, Model, ModelFieldLine } from "@/generate/prisma";
import { useEffect, useState } from "react";
import { getFieldsMany2one } from "../../models/actions";
import TableTemplate from "@/components/templates/TableTemplate";
import { createGroupLine } from "../actions";
import toast from "react-hot-toast";

type TInputs = {
  entityName: string;
  fieldName: string;
  notCreate: boolean;
  noEdit: boolean;
  invisible: boolean;
  required: boolean;
  readonly: boolean;
  model: Model | null;
  field: ModelFieldLine | null;
};

function GroupAccesModelsForm({
  modelId,
  modelList,
  getNewValue,
}: {
  modelId: string | null;
  modelList: Model[];
  getNewValue: (data: GroupLine | null | undefined) => void;
}) {
  const {
    register,
    reset,
    handleSubmit,
    setFocus,
    watch,
    control,
    formState: { isSubmitting },
  } = useForm<TInputs>();

  const [modelMany2one] = watch(["model", "field"]);

  const [fielsMany2one, setFieldsMany2one] = useState<ModelFieldLine[]>([]);

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    const newData = {
      entityName: data.model?.name || "",
      fieldName: data.field?.name || "",
      notCreate: data.notCreate,
      noEdit: data.noEdit,
      invisible: data.invisible,
      readonly: data.readonly,
      required: data.required,
      modelId,
    };
    const res = await createGroupLine(newData);
    if (!res.success) {
      toast.error(res.message, { position: "top-right" });
      return;
    }

    reset({
      entityName: "",
      fieldName: "",
      field: null,
      model: null,
      noEdit: false,
      notCreate: false,
      readonly: false,
      invisible: false,
      required: false,
    });

    getNewValue(res.data);
  };

  const handleFetchFieldsMany2one = async () => {
    const res = await getFieldsMany2one({
      domain: ["and", ["modelId", "=", modelMany2one?.id]],
    });
    console.log(res.data);
    if (res.success) setFieldsMany2one(res.data || []);
  };

  useEffect(() => {
    if (modelMany2one) {
      handleFetchFieldsMany2one();
    } else {
      setFieldsMany2one([]);
    }
  }, [modelMany2one]);

  useEffect(() => {
    if (!isSubmitting) setFocus("model");
  }, [isSubmitting]);

  return (
    <fieldset disabled={isSubmitting}>
      <TableTemplate>
        <TableTemplate.Header>
          <TableTemplate.Column name="manyModel">
            <Many2one
              {...register("model", { required: true })}
              control={control}
              callBackMode="object"
              options={modelList}
              label="Modelo"
              size="sm"
            />
          </TableTemplate.Column>
          <TableTemplate.Column name="manyFields">
            <Many2one
              {...register("field")}
              size="sm"
              control={control}
              label="Campos"
              options={fielsMany2one}
              callBackMode="object"
            />
          </TableTemplate.Column>
          <TableTemplate.Column name="notCreate">
            <Form.Check
              {...register("notCreate")}
              label="No crear"
              id="No crear"
            />
          </TableTemplate.Column>
          <TableTemplate.Column name="noEdit">
            <Form.Check
              {...register("noEdit")}
              label="No editar"
              id="No editar"
            />
          </TableTemplate.Column>
          <TableTemplate.Column name="invisible">
            <Form.Check {...register("invisible")} label="Oculto" id="Oculto" />
          </TableTemplate.Column>
          <TableTemplate.Column name="required">
            <Form.Check
              {...register("required")}
              label="Requerido"
              id="Requerido"
            />
          </TableTemplate.Column>
          <TableTemplate.Column name="readonly">
            <Form.Check
              {...register("readonly")}
              label="Solo lectura"
              id="Solo lectura"
            />
          </TableTemplate.Column>
          <TableTemplate.Column name="bntSubmit">
            <Button type="button" size="sm" onClick={handleSubmit(onSubmit)}>
              <i className="bi bi-plus-circle"></i>
            </Button>
          </TableTemplate.Column>
        </TableTemplate.Header>
      </TableTemplate>
    </fieldset>
  );
}

export default GroupAccesModelsForm;
