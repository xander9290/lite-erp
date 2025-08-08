"use client";

import FormTemplate, {
  FormBook,
  FormPage,
  ViewGroup,
  ViewGroupFluid,
} from "@/components/templates/FormTemplate";
import { useForm, SubmitHandler } from "react-hook-form";
import { createModel, ModelsWithAttrs } from "../actions";
import { Form } from "react-bootstrap";
import { ModelFieldLine } from "@/generate/prisma";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createActivity } from "@/app/actions/user-actions";
import ModelsFieldList from "./ModelsFieldList";
import ModelsFormCreateField, {
  TInputsModelsFields,
} from "./ModelsFormCreateField";

type TInputs = {
  name: string;
  label: string;
  fieldLines: ModelFieldLine[];
  active: boolean;
};

function ModelsFormView({
  model,
  modelId,
}: {
  modelId: string | null;
  model: ModelsWithAttrs | null;
}) {
  const {
    register,
    formState: { isDirty, isSubmitting, errors },
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<TInputs>();

  const [fields] = watch(["fieldLines"]);

  const originalValuesRef = useRef<TInputs | null>(null);
  const router = useRouter();

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    if (modelId === "null") {
      const res = await createModel(data);
      if (!res.success) {
        toast.error(res.message, { position: "top-right" });
        return;
      }
      await createActivity({
        entityId: res.data || "",
        entityName: "models",
        string: "Ha creado el modelo " + data.name,
      });
      router.replace(`/app/models?view_mode=form&id=${res.data}`);
    } else {
    }
  };

  const handleGetValues = (data: TInputsModelsFields) => {
    const newFields = [...fields, data];
    console.log(newFields);
    setValue("fieldLines", newFields, { shouldDirty: true });
  };

  const handelRevert = () => {};

  useEffect(() => {
    if (model) {
      const initValues: TInputs = {
        name: model.name,
        fieldLines: model.fieldLines,
        active: model.active,
        label: model.label,
      };
      originalValuesRef.current = initValues;
      reset(initValues);
    } else {
      originalValuesRef.current = null;
      reset({ name: "", label: "", active: true, fieldLines: [] });
    }
  }, [model]);

  return (
    <FormTemplate
      entityName="models"
      viewForm="/app/models?view_mode=form&id=null"
      revert={handelRevert}
      name={model?.displayName}
      withActivity={true}
      isDirty={isDirty}
      onSubmit={handleSubmit(onSubmit)}
      active={model?.active ?? true}
      disableForm={isSubmitting}
    >
      <ViewGroup title="Información del modelo">
        <Form.Group controlId="ModelName" className="mb-3">
          <Form.Label>Nombre técnico:</Form.Label>
          <Form.Control
            {...register("name", { required: "Este campo es requrido" })}
            type="text"
            autoComplete="off"
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="ModelName" className="mb-3">
          <Form.Label>Etiqueta:</Form.Label>
          <Form.Control
            {...register("label", { required: "Este campo es requrido" })}
            type="text"
            autoComplete="off"
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </ViewGroup>
      <ViewGroupFluid>
        <FormBook dKey="Campos">
          <FormPage title="Campos" eventKey="fields">
            <ModelsFormCreateField getValues={handleGetValues} />
            <ModelsFieldList fieldLines={fields || []} />
          </FormPage>
        </FormBook>
      </ViewGroupFluid>
    </FormTemplate>
  );
}

export default ModelsFormView;
