"use client";

import { createActivity, fetchActivity } from "@/app/actions/user-actions";
import { Activity, Image as Img, User } from "@/generate/prisma";
import { formatDate } from "@/libs/helpers";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

type PartnerWithImage = {
  Image: Img | null;
};

interface UserWithPartner extends User {
  partner: PartnerWithImage | null;
}

export interface ActivityWithUser extends Activity {
  createBy: UserWithPartner | null;
}

type TInputs = {
  string: string;
};

const date = Date.now() || null;

function ActivityTemplate({
  entityId,
  entityName,
}: {
  entityId: string | null;
  entityName: string | null;
}) {
  const { data: session } = useSession();

  const [activities, setActivities] = useState<ActivityWithUser[]>([]);
  const [showFormNotes, setShowFormNotes] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<TInputs>({
    defaultValues: {
      string: "",
    },
  });

  const handleFetchActivities = async () => {
    const res = await fetchActivity({ entityId, entityName });
    if (res.success) {
      setActivities(res.data || []);
    } else {
      setActivities([]);
    }
  };

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    const newData = {
      string: data.string,
      entityId: entityId || "",
      entityName: entityName || "",
    };
    const res = await createActivity(newData);
    if (!res.success) {
      toast.error(res.message, { position: "top-right" });
      return;
    }
    const changedActivities = [res.data, ...activities].filter(
      (activity): activity is ActivityWithUser => activity != null
    );
    setActivities(changedActivities);
    setShowFormNotes(!showFormNotes);
  };

  useEffect(() => {
    if (entityId && entityName) {
      if (entityId !== "null" && entityName !== null) {
        handleFetchActivities();
      } else {
        setActivities([]);
      }
    }
  }, [entityId]);

  useEffect(() => {
    if (!showFormNotes) {
      reset({ string: "" });
    }
  }, [showFormNotes]);

  return (
    <Card style={{ height: "100%" }} className="d-flex flex-column">
      <Card.Header>
        <div>
          <Button
            type="button"
            onClick={() => setShowFormNotes(!showFormNotes)}
            disabled={entityId === "null"}
          >
            <i className="bi bi-pencil-square me-1"></i>
            <span>Escribir nota</span>
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="flex-fill overflow-auto">
        {showFormNotes && (
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="mb-3 card card-body bg-body-tertiary"
          >
            <fieldset disabled={isSubmitting}>
              <Form.Group className="mb-1">
                <Form.Control
                  {...register("string", {
                    required: "Este campo es requerido",
                  })}
                  placeholder="Agregar una nota"
                  type="text"
                  autoComplete="off"
                  autoFocus
                  isInvalid={!!errors.string}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.string?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="d-flex gap-2">
                <Button disabled={!isDirty} variant="success" type="submit">
                  Agregar
                </Button>
                <Button
                  onClick={() => setShowFormNotes(!showFormNotes)}
                  variant="warning"
                  type="button"
                >
                  Cancelar
                </Button>
              </Form.Group>
            </fieldset>
          </Form>
        )}
        {activities.length === 0 ? (
          <div className="mb-3">
            <div className="d-flex align-items-end">
              <Image
                src={session?.user.image ?? "/image/avatar_default.svg"}
                unoptimized
                width={40}
                height={40}
                alt=""
                className="me-1"
              />
              <Card.Text className="ms-2 d-flex flex-column">
                <span>
                  <strong className="me-2 text-capitalize">
                    {session?.user.name}
                  </strong>
                  <span>{formatDate(date || null) || ""}</span>
                </span>
                <span>
                  {entityId === "null"
                    ? "Está craendo un registro..."
                    : "Está editando un regstro..."}
                </span>
              </Card.Text>
            </div>
          </div>
        ) : (
          <>
            {activities.map((activity) => (
              <div key={activity.id} className="d-flex align-items-start mb-3">
                <Image
                  src={
                    activity.createBy?.partner?.Image?.url ??
                    "/image/avatar_default.svg"
                  }
                  unoptimized
                  width={40}
                  height={40}
                  alt=""
                  className="me-1 mt-2"
                />
                <Card.Text className="ms-1 d-flex flex-column">
                  <span>
                    <strong className="me-1 text-capitalize">
                      {activity.createBy?.name}
                    </strong>
                    <span>{formatDate(activity.createdAt) || ""}</span>
                  </span>
                  <span>{activity.string}</span>
                </Card.Text>
              </div>
            ))}
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default ActivityTemplate;
