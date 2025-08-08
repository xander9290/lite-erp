"use client";
import { Button, Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";

export type TInputsModelsFields = {
  name: string;
  displayName: string;
  active: boolean;
  type: string;
  required: boolean;
  id: string;
};

function ModelsFormCreateField({
  getValues,
}: {
  getValues: (data: TInputsModelsFields) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TInputsModelsFields>();

  const onSubmit: SubmitHandler<TInputsModelsFields> = async (data) => {
    const newData: TInputsModelsFields = {
      ...data,
      displayName: data.name,
      id: Date.now().toString(),
    };
    getValues(newData);
  };

  return (
    <div className="d-flex align-items-center flex-sm-nowrap gap-2 py-2">
      <Form.Control
        {...register("name", { required: true })}
        type="text"
        autoComplete="off"
        placeholder="Nombre"
        isInvalid={!!errors.name}
        className="flex-grow-1"
      />
      <Form.Select {...register("type", { required: true })}>
        <option value=""></option>
        <option value="text">Texto</option>
        <option value="number">Numérico</option>
        <option value="date">Fecha</option>
        <option value="boolean">Booleano</option>
      </Form.Select>
      <Form.Check {...register("required")} label="Requierido" id="Requerido" />
      <Button type="button" onClick={handleSubmit(onSubmit)}>
        <i className="bi bi-plus-circle"></i>
      </Button>
    </div>
  );
}

export default ModelsFormCreateField;
