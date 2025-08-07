"use client";

import FormTemplate from "@/components/templates/FormTemplate";
import { useForm, SubmitHandler } from "react-hook-form";
import { ModelsWithAttrs } from "../actions";

interface TInputs extends ModelsWithAttrs {}

function ModelsFormView() {
  const {
    register,
    formState: { isDirty, isSubmitting },
  } = useForm<TInputs>();

  const handelRevert = () => {};

  return (
    <FormTemplate
      entityName="models"
      viewForm="/app/models?view_mode=form&id=null"
      revert={handelRevert}
      name="Nombre"
      withActivity={true}
      isDirty={isDirty}
    >
      <h2>Formulario</h2>
    </FormTemplate>
  );
}

export default ModelsFormView;
