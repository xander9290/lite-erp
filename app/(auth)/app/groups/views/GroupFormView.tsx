"use client";

import FormTemplate, {
  FormBook,
  FormPage,
  ViewGroup,
} from "@/components/templates/FormTemplate";
import { Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { GroupWithAttrs } from "../actions";
import { useEffect, useRef } from "react";
import GroupListUsers from "./GroupListUsers";

type TInputs = {
  name: string;
};

function GroupFormView({ group }: { group: GroupWithAttrs | null }) {
  const {
    register,
    formState: { isDirty, errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<TInputs>();

  const originalValuesRef = useRef<TInputs | null>(null);

  const onSubmit: SubmitHandler<TInputs> = (data) => {
    // Handle form submission logic here
    console.log("Form submitted with data:", data);
  };

  const handleRevert = () => {
    if (originalValuesRef.current) {
      reset(originalValuesRef.current);
    }
  };

  useEffect(() => {
    // This effect can be used to initialize form values or perform side effects
    if (group) {
      const initialValues: TInputs = {
        name: group.name || "",
      };
      originalValuesRef.current = initialValues;
      reset(initialValues);
    } else {
      originalValuesRef.current = null;
      reset({ name: "" });
    }
  }, [group]);

  return (
    <FormTemplate
      viewForm="/app/groups?view_mode=form&id=null"
      entityName="groups"
      revert={handleRevert}
      formStates={[]}
      isDirty={isDirty}
      disableForm={isSubmitting}
      withActivity={true}
      onSubmit={handleSubmit(onSubmit)}
      name={group?.name || ""}
    >
      <ViewGroup>
        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre del grupo"
            {...register("name", { required: "El nombre es requerido" })}
            isInvalid={!!errors.name}
            autoComplete="off"
          />
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </ViewGroup>
      <FormBook dKey="lines">
        <FormPage title="Accesos" eventKey="lines">
          <h6>Accesos</h6>
        </FormPage>
        <FormPage title="Usuarios" eventKey="users">
          <GroupListUsers users={group?.users || []} />
        </FormPage>
      </FormBook>
    </FormTemplate>
  );
}

export default GroupFormView;
