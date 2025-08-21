"use client";

import FormTemplate, { ViewGroup } from "@/components/templates/FormTemplate";
import { PartnerContacts } from "@/libs/definitions";
import useFields from "@/ui/fields/useFields";
import { Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";

type TInputs = {
  name: string;
  state: string;
  related: string;
};

function ContactsFormView({ partner }: { partner: PartnerContacts | null }) {
  const { Entry, Selection, Relation, AppButton } = useFields({
    accessModel: "partners",
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitting, errors },
    control,
  } = useForm<TInputs>();

  const onSubmit: SubmitHandler<TInputs> = () => {};

  const handleRevert = () => {};

  return (
    <FormTemplate
      onSubmit={handleSubmit(onSubmit)}
      isDirty={isDirty}
      revert={handleRevert}
      disableForm={isSubmitting}
      viewForm="/app/contacts?view_mode=form&id=null&type=internal"
      entityName="partners"
      withActivity={true}
      name={partner?.name}
      active={partner?.active}
      formActions={[
        {
          action: () => alert("Hola"),
          name: "email",
          string: "Saludo",
        },
      ]}
    >
      <ViewGroup>
        <Entry
          register={register("name", { required: "Este campo es obligatorio" })}
          fieldName="name"
          label="Nombre:"
          invalid={!!errors.name}
          feedBack={
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          }
        />
        <div className="d-flex justify-content-between gap-2">
          <Selection
            options={[
              { value: "", label: "" },
              { value: "active", label: "Activo" },
            ]}
            label="Estado:"
            register={register("state")}
            fieldName="state"
          />
          <Relation
            options={[
              { id: "1", name: "Uno", displayName: "[1] Uno" },
              { id: "2", name: "Dos", displayName: "[2] Dos" },
            ]}
            register={register("related", { required: true })}
            control={control}
            fieldName="displayName"
            callBackMode="id"
            label="Relacion:"
          />
        </div>
        <AppButton
          label="Hola"
          fieldName="btnHola"
          action={() => alert("hola")}
        />
      </ViewGroup>
    </FormTemplate>
  );
}

export default ContactsFormView;
