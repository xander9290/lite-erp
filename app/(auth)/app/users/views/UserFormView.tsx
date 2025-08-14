"use client";

import FormTemplate, {
  FormBook,
  FormPage,
  TFormState,
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
import { useAccess } from "@/context/AccessContext";

type TInputs = {
  name: string;
  login: string;
  email: string | null;
  groupId: string | null;
  active: boolean;
};

const formStates: TFormState[] = [
  {
    name: "not_confirmed",
    label: "sin confirmar",
  },
  {
    name: "confirmed",
    label: "confirmado",
  },
];

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
    if (!user?.active) return;
    setModalChangeUserPassword(true);
  };

  useEffect(() => {
    if (user) {
      reset({
        login: user.login,
        name: user.partner?.name,
        email: user.partner?.email,
        groupId: user.groupId || null,
        active: user.active,
      });

      originalValuesRef.current = {
        login: user.login,
        name: user.partner?.name || "",
        email: user.partner?.email || "",
        groupId: user.groupId || null,
        active: user.active,
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
        active: true,
      };
    }
  }, [user]);

  const access = useAccess("app");

  const userAccess = useAccess("users");

  const isAllowed = access.find(
    (field) => field.fieldName === "settingsUsersMenu"
  );

  if (isAllowed && isAllowed?.invisible)
    return <h2 className="text-center">🚫 VISTA NO PERMITIDA</h2>;

  const resetPasswordBtnAccess = userAccess.find(
    (field) => field.fieldName === "resetPassword"
  )?.readonly;

  const fieldLogin = userAccess.find((field) => field.fieldName === "login");

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
        formStates={formStates}
        state={user?.state ?? "not_confirmed"}
        formActions={[
          {
            string: "Restablecer contraseña",
            action: () => handleChangePassword(),
            disable: resetPasswordBtnAccess,
            name: "resetPassword",
          },
        ]}
        active={user?.active}
      >
        <ViewGroup title="Acceso">
          <Form.Group
            style={{
              pointerEvents: fieldLogin?.readonly ? "none" : "auto",
              display: fieldLogin?.invisible ? "none" : "block",
            }}
            controlId="userLogin"
            className="mb-3"
          >
            <Form.Label title="login">Usuario:</Form.Label>
            <Form.Control
              {...register("login", { required: "Este campo es requerido" })}
              type="text"
              autoComplete="off"
              isInvalid={!!errors.login}
              disabled={user?.active === false}
            />
            <Form.Control.Feedback type="invalid">
              {errors.login?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="userGroupId" className="mb-3">
            <Form.Label title="groupId">Grupo:</Form.Label>
            <Many2one<GroupWithAttrs>
              {...register("groupId")}
              control={control}
              options={groups || []}
              callBackMode="id"
              disabled={user?.active === false}
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="switch"
              label="Activo"
              id="Activo"
              {...register("active")}
            />
          </Form.Group>
        </ViewGroup>
        <ViewGroup title="Información personal">
          <Form.Group controlId="userName" className="mb-3">
            <Form.Label title="name">Nombre:</Form.Label>
            <Form.Control
              {...register("name", { required: "Este campo es requerido" })}
              type="text"
              isInvalid={!!errors.name}
              autoComplete="off"
              disabled={user?.active === false}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="userEmail" className="mb-3">
            <Form.Label title="email">Correo:</Form.Label>
            <Form.Control
              {...register("email")}
              type="email"
              autoComplete="off"
              disabled={user?.active === false}
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
