"use client";

import FormTemplate, {
  FormBook,
  FormPage,
  TFormState,
  ViewGroup,
} from "@/components/templates/FormTemplate";
import { UserWithPartner } from "@/libs/definitions";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { createUser, updateUser } from "../actions";
import { useRouter } from "next/navigation";
import { createActivity } from "@/app/actions/user-actions";
import { GroupWithAttrs } from "../../groups/actions";
import ModalChangeUserPassword from "@/components/modals/ModalChangeUserPassword";
import { useAccess } from "@/context/AccessContext";
import { useModals } from "@/context/ModalContext";
import VistaNoPermitida from "@/ui/NotAllowed";
import useFields from "@/ui/fields/useFields";

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
  const { Entry, Relation, Boolean, PageContent } = useFields({
    accessModel: "users",
  });

  const { modalError } = useModals();

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
        modalError(res.message);
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
        modalError(res.message);
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

  const isAllowed = access.find(
    (field) => field.fieldName === "settingsUsersMenu"
  );

  if (isAllowed && isAllowed?.invisible) return <VistaNoPermitida />;

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
            name: "resetPassword",
          },
        ]}
        active={user?.active ?? true}
      >
        <ViewGroup title="Acceso">
          <Entry
            register={register("login", {
              required: "Este campo es requerido",
            })}
            label="Usuario:"
            fieldName="login"
            invalid={!!errors.login}
            feedBack={errors.login?.message}
          />
          <Relation
            options={groups || []}
            callBackMode="id"
            label="Grupo:"
            fieldName="groupId"
            register={register("groupId")}
            control={control}
          />
          <Boolean
            type="switch"
            fieldName="active"
            label="Activo"
            register={register("active")}
          />
        </ViewGroup>
        <ViewGroup title="Información personal">
          <Entry
            register={register("name", { required: "Este campo es requerido" })}
            invalid={!!errors.name}
            label="Nombre:"
            fieldName="name"
            feedBack={
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            }
          />
          <Entry
            label="Correo:"
            fieldName="email"
            type="email"
            register={register("email")}
          />
        </ViewGroup>
        <FormBook dKey="partnerLeads">
          <FormPage eventKey="partnerLeads" title="Carterta">
            <h3>Cartera de clientes</h3>
          </FormPage>
          <FormPage eventKey="otherInfo" title="Otra información">
            <PageContent fieldName="otherInfo">
              <Entry
                register={register("email")}
                fieldName="otra"
                label="Otra"
              />
            </PageContent>
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
