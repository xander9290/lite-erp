"use client";

import FormTemplate, {
  FormBook,
  FormPage,
  ViewGroup,
} from "@/components/templates/FormTemplate";
import { Button, Form, Table } from "react-bootstrap";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import {
  createGroup,
  GroupWithAttrs,
  removeUser,
  updateGroup,
} from "../actions";
import { useEffect, useRef, useState } from "react";
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
import { useModals } from "@/context/ModalContext";

export type TUserInputs = {
  idDb: string | null;
  id: string;
  name: string;
};

type TInputs = {
  name: string;
  userId: User | null;
  users: TUserInputs[];
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
  const { modalError } = useModals();
  const { data: session } = useSession();
  const {
    register,
    formState: { isDirty, errors, isSubmitting },
    handleSubmit,
    reset,
    control,
    watch,
  } = useForm<TInputs>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "users",
  });

  const [userId, users, lines] = watch(["userId", "users", "groupLine"]);

  const originalValuesRef = useRef<TInputs | null>(null);
  const router = useRouter();

  const [modelsMany2one, setModelsMany2one] = useState<Model[]>([]);

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    if (modelId && modelId === "null") {
      const newData = {
        name: data.name,
        users: data.users,
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
        users: data.users,
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
        active: group.active,
        groupLine: group.groupLines,
        users: group.users.map((u) => ({
          id: u.id,
          idDb: u.id || "",
          name: u.name || "",
        })),
      };
      originalValuesRef.current = initialValues;
      reset(initialValues);
    } else {
      originalValuesRef.current = null;
      reset({
        name: "",
        userId: null,
        users: [],
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
          <Table striped bordered>
            
          </Table>
        </FormPage>
        <FormPage
          title={`Usuarios (${group?.users.length ?? 0})`}
          eventKey="usersPage"
        >
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th className="text-center">
                  <i className="bi bi-trash3"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, i) => (
                <tr key={field.id}>
                  <th className="px-0">
                    <Many2one
                      {...register(`users.${i}.id` as const)} // 👉 path correcto en el array
                      options={usersMany2one}
                      control={control}
                      callBackMode="id"
                      size="sm"
                    />
                  </th>
                  <th className="text-center">
                    <Button
                      size="sm"
                      onClick={async () => {
                        if (field.idDb) {
                          const res = await removeUser({
                            modelId,
                            userId: field.idDb,
                          });
                          if (!res.success) {
                            modalError(res.message);
                          } else {
                            remove(i);
                          }
                        }
                      }}
                    >
                      <i className="bi bi-trash3"></i>
                    </Button>
                  </th>
                </tr>
              ))}
              <tr>
                <td className="p-0">
                  <Button
                    onClick={() => append({ id: "", name: "", idDb: "" })}
                    size="sm"
                    type="button"
                    variant="link"
                  >
                    Agregar usuario
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </FormPage>
      </FormBook>
    </FormTemplate>
  );
}

export default GroupFormView;
