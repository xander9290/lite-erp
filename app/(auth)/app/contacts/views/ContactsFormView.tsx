"use client";

import FormTemplate from "@/components/templates/FormTemplate";
import { PartnerContacts } from "@/libs/definitions";
import { useForm, SubmitHandler } from "react-hook-form";

type TInputs = {
  name: string;
};

function ContactsFormView({ partner }: { partner: PartnerContacts | null }) {
  const {
    handleSubmit,
    formState: { isDirty, isSubmitting },
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
    >
      <h1>Formulario</h1>
    </FormTemplate>
  );
}

export default ContactsFormView;
