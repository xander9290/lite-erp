"use client";

import FormTemplate, {
  FormBook,
  FormPage,
  ViewGroup,
} from "@/components/templates/FormTemplate";
import { UserWithPartner } from "@/libs/definitions";
import { Many2one } from "@/ui/Many2one";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { createUser, updateUser } from "../actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createActivity } from "@/app/actions/user-actions";
import { GroupWithAttrs } from "../../groups/actions";
import ModalChangeUserPassword from "@/components/modals/ModalChangeUserPassword";

type TInputs = {
  name: string;
  login: string;
  email: string | null;
  groupId: string | null;
};

function UserFormView({
  user,
  modelId,
  groups,
}: {
  user: UserWithPartner | null;
  modelId: string | null;
  groups: GroupWithAttrs[] | null;
}) {
  const [modalChangeUserPassword, setModalChangeUserPassword] = useState(false);

  const originalValuesRef = useRef<TInputs | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    control,
    reset,
  } = useForm<TInputs>();

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    if (modelId === "null") {
      const res = await createUser(data);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      await createActivity({
        entityId: modelId,
        entityName: "users",
        string: `Ha creado el usuario ${data.name}`,
      });
      router.replace(`/app/users?view_mode=form&id=${res.data}`);
    } else {
      const newData = {
        ...data,
        partnerId: user?.partnerId || "",
      };
      const res = await updateUser(newData);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      await createActivity({
        entityId: modelId || "",
        entityName: "users",
        string: "Ha editado el regristro",
      });
    }
  };

  const handleRevert = () => {
    if (originalValuesRef.current) {
      reset(originalValuesRef.current);
    }
  };

  const handleChangePassword = () => {
    setModalChangeUserPassword(true);
  };

  useEffect(() => {
    if (user) {
      reset({
        login: user.login,
        name: user.partner?.name,
        email: user.partner?.email,
        groupId: user.groupId || null,
      });

      originalValuesRef.current = {
        login: user.login,
        name: user.partner?.name || "",
        email: user.partner?.email || "",
        groupId: user.groupId || null,
      };
    } else {
      reset({
        login: "",
        name: "",
        email: "",
        groupId: null,
      });

      originalValuesRef.current = {
        login: "",
        name: "",
        email: "",
        groupId: null,
      };
    }
  }, [user]);

  return (
    <>
      <FormTemplate
        revert={handleRevert}
        isDirty={isDirty}
        name={user?.partner?.name}
        onSubmit={handleSubmit(onSubmit)}
        viewForm="/app/users?view_mode=form&id=null"
        disableForm={isSubmitting}
        withActivity={true}
        entityName="users"
        formActions={[
          {
            string: "Restablecer contraseña",
            action: () => handleChangePassword(),
          },
        ]}
      >
        <ViewGroup title="Acceso">
          <Form.Group controlId="userLogin" className="mb-3">
            <Form.Label>Usuario:</Form.Label>
            <Form.Control
              {...register("login", { required: "Este campo es requerido" })}
              type="text"
              autoComplete="off"
              isInvalid={!!errors.login}
            />
            <Form.Control.Feedback type="invalid">
              {errors.login?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="userGroupId">
            <Many2one<GroupWithAttrs>
              {...register("groupId")}
              label="Grupo:"
              control={control}
              options={groups || []}
            />
          </Form.Group>
        </ViewGroup>
        <ViewGroup title="Información personal">
          <Form.Group controlId="userName" className="mb-3">
            <Form.Label>Nombre:</Form.Label>
            <Form.Control
              {...register("name", { required: "Este campo es requerido" })}
              className="text-capitalize"
              type="text"
              isInvalid={!!errors.name}
              autoComplete="off"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="userEmail" className="mb-3">
            <Form.Label>Correo:</Form.Label>
            <Form.Control
              {...register("email")}
              type="email"
              autoComplete="off"
            />
          </Form.Group>
        </ViewGroup>
        <FormBook dKey="leads">
          <FormPage title="Cartera" eventKey="leads">
            <h2>Cartera de clientes</h2>
          </FormPage>
          <FormPage title="Otra información" eventKey="otherInfo">
            <h3>otra información</h3>
          </FormPage>
        </FormBook>
      </FormTemplate>
      {modalChangeUserPassword && (
        <ModalChangeUserPassword
          show={modalChangeUserPassword}
          onHide={() => setModalChangeUserPassword(false)}
          modelId={modelId}
        />
      )}
    </>
  );
}

export default UserFormView;
