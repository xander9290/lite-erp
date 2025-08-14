"use client";

import FormTemplate, {
  FormBook,
  FormPage,
  ViewGroup,
} from "@/components/templates/FormTemplate";
import { Button, Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  createGroup,
  GroupWithAttrs,
  removeUser,
  updateGroup,
} from "../actions";
import { useCallback, useEffect, useRef, useState } from "react";
import GroupListUsers from "./GroupListUsers";
import { Many2one } from "@/ui/Many2one";
import toast from "react-hot-toast";
import { GroupLine, Model, User } from "@/generate/prisma";
import { useRouter } from "next/navigation";
import { createActivity } from "@/app/actions/user-actions";
import { useSession } from "next-auth/react";
import GroupAccesModelsForm from "./GroupAccesModelsForm";
import { getModelsMany2one } from "../../models/actions";
import GroupAccessList from "./GroupAccessList";
import { useAccess } from "@/context/AccessContext";

type TInputs = {
  name: string;
  userId: User | null;
  userIds: User[];
  active: boolean;
  groupLine: GroupLine[];
};

function GroupFormView({
  group,
  modelId = null,
  usersMany2one = [],
}: {
  group: GroupWithAttrs | null;
  modelId: string | null;
  usersMany2one: User[];
}) {
  const { data: session } = useSession();
  const {
    register,
    formState: { isDirty, errors, isSubmitting },
    handleSubmit,
    reset,
    control,
    watch,
  } = useForm<TInputs>();

  const [userId, userIds, lines] = watch(["userId", "userIds", "groupLine"]);

  const originalValuesRef = useRef<TInputs | null>(null);
  const router = useRouter();

  const [modelsMany2one, setModelsMany2one] = useState<Model[]>([]);

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    if (modelId && modelId === "null") {
      const newData = {
        name: data.name,
        userIds: data.userIds as [],
      };

      const res = await createGroup(newData);

      if (!res.success) {
        toast.error(res.message, { position: "top-right" });
        return;
      }

      await createActivity({
        entityId: session?.user.id,
        entityName: "groups",
        string: `Ha creado el grupo ${data.name}`,
      });

      router.replace(`/app/groups?view_mode=form&id=${res.data?.id}`);
    } else {
      const newData = {
        name: data.name,
        userIds: data.userIds,
        modelId: modelId || "",
        active: data.active,
      };

      const res = await updateGroup(newData);

      if (!res.success) {
        toast.error(res.message, { position: "top-right" });
        return;
      }

      await createActivity({
        entityId: modelId || "",
        entityName: "groups",
        string: `Ha editado el grupo`,
      });

      router.replace(`/app/groups?view_mode=form&id=${res.data}`);
    }
  };

  const handleRevert = () => {
    if (originalValuesRef.current) {
      reset(originalValuesRef.current);
    }
  };

  const handleAddUser = async () => {
    const checkUser = userIds.find((user) => user.id === userId?.id);

    if (checkUser) {
      toast.error("El usuario ya está en la lista", {
        position: "top-center",
      });
      return;
    }

    const newUsers = [...userIds, userId || {}];
    reset({ userIds: newUsers });
  };

  const handleRemoveUser = useCallback(async (userTargetId: string | null) => {
    if (userTargetId && modelId) {
      const res = await removeUser({ groupId: modelId, userId: userTargetId });
      if (res.success) {
        toast.success("Usuario eliminado del grupo", {
          position: "top-right",
        });
        await createActivity({
          entityId: modelId,
          entityName: "groups",
          string: `Ha removido un usuario`,
        });
      } else {
        toast.error(res.message, { position: "top-right" });
      }
    }
  }, []);

  const handleAddAccess = (data: GroupLine | undefined | null) => {
    if (!data) return;
    const newAccess = [...lines, data];
    reset({ groupLine: newAccess });
  };

  useEffect(() => {
    // This effect can be used to initialize form values or perform side effects
    if (group) {
      const initialValues: TInputs = {
        name: group.name || "",
        userId: null,
        userIds: group.users,
        active: group.active,
        groupLine: group.groupLines,
      };
      originalValuesRef.current = initialValues;
      reset(initialValues);
    } else {
      originalValuesRef.current = null;
      reset({
        name: "",
        userId: null,
        userIds: [],
        active: true,
        groupLine: [],
      });
    }
  }, [group]);

  useEffect(() => {
    const fetchModelsMany2one = async () => {
      const res = await getModelsMany2one({
        domain: ["and", ["active", "=", true]],
      });

      if (!res.success) return;
      const data = res.data || [];
      setModelsMany2one(data);
    };

    fetchModelsMany2one();
  }, []);

  const access = useAccess("app");
  const isAllowed = access.find(
    (field) => field.fieldName === "settingsGroupsMenu"
  );

  if (isAllowed && isAllowed?.invisible)
    return <h2 className="text-center">🚫 VISTA NO PERMITIDA</h2>;

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
      active={group?.active ?? true}
    >
      <ViewGroup>
        <Form.Group controlId="GroupName" className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre del grupo"
            {...register("name", { required: "El nombre es requerido" })}
            isInvalid={!!errors.name}
            autoComplete="off"
            disabled={group?.active === false}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="GroupActive">
          <Form.Check {...register("active")} label="Activo" id="Activo" />
        </Form.Group>
      </ViewGroup>
      <FormBook dKey="accessPage">
        <FormPage title="Accesos" eventKey="accessPage">
          <GroupAccessList groupLines={lines} />
          <GroupAccesModelsForm
            getNewValue={handleAddAccess}
            modelList={modelsMany2one}
            modelId={modelId}
          />
        </FormPage>
        <FormPage
          title={`Usuarios (${group?.users.length ?? 0})`}
          eventKey="usersPage"
        >
          <div className="d-flex py-2">
            <Many2one<User>
              {...register("userId")}
              control={control}
              options={usersMany2one}
              label="Añadir usuario"
              size="sm"
              callBackMode="object"
              disabled={group?.active === false}
            />
            <Button
              size="sm"
              type="button"
              onClick={handleAddUser}
              className="ms-1"
            >
              <i className="bi bi-plus-circle"></i>
            </Button>
          </div>
          <GroupListUsers
            handelRemoveUser={handleRemoveUser}
            users={userIds || []}
          />
        </FormPage>
      </FormBook>
    </FormTemplate>
  );
}

export default GroupFormView;
