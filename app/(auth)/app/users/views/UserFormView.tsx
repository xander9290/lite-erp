"use client";

import FormTemplate, { ViewGroup } from "@/components/templates/FormTemplate";
import { UserWithPartner } from "@/libs/definitions";
import { Many2one } from "@/ui/Many2one";
import { Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";

type TInputs = {
  name: string;
  login: string;
  password: string;
  groupId: string | null;
  email: string | null;
};

function UserFormView({ user }: { user: UserWithPartner | null }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    control,
  } = useForm<TInputs>({
    defaultValues: {
      name: user?.partner?.name,
      login: user?.login,
      groupId: user?.groupId,
      email: user?.partner?.email,
    },
  });

  const onSubmit: SubmitHandler<TInputs> = async (data) => {};

  const handleRevert = () => {};

  return (
    <FormTemplate
      onSubmit={handleSubmit(onSubmit)}
      revert={handleRevert}
      isDirty={isDirty}
      disableForm={isSubmitting}
      name={user?.partner?.name || ""}
      viewForm="/app/users?view_mode=form&id=null"
    >
      <ViewGroup title="Acceso">
        <Form.Group controlId="UserLogin" className="mb-3">
          <Form.Label>Usuario:</Form.Label>
          <Form.Control
            {...register("login")}
            type="text"
            autoComplete="off"
            size="sm"
          />
        </Form.Group>
        <Form.Group controlId="UserPassword" className="mb-3">
          <Form.Label>Contraseña:</Form.Label>
          <Form.Control
            {...register("password")}
            type="password"
            autoComplete="off"
            size="sm"
            className="text-center"
          />
        </Form.Group>
        <Form.Group controlId="UserGroupId" className="mb-3">
          <Form.Label>Grupo:</Form.Label>
          <Many2one {...register("groupId")} control={control} options={[]} />
        </Form.Group>
        <Form.Group controlId="UserPartnerId">
          <Form.Label>Contacto:</Form.Label>
          <Form.Text className="text-uppercase">
            {" "}
            {user?.partner?.name}
          </Form.Text>
        </Form.Group>
      </ViewGroup>
      <ViewGroup title="Información personal">
        <Form.Group controlId="UserName" className="mb-3">
          <Form.Label>Nombre:</Form.Label>
          <Form.Control
            {...register("name")}
            type="text"
            autoComplete="off"
            size="sm"
            className="text-capitalize"
          />
        </Form.Group>
        <Form.Group controlId="UserEmail" className="mb-3">
          <Form.Label>Correo:</Form.Label>
          <Form.Control
            {...register("email")}
            type="text"
            autoComplete="off"
            size="sm"
          />
        </Form.Group>
      </ViewGroup>
    </FormTemplate>
  );
}

export default UserFormView;
