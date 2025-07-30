"use client";

import { updateUserProfile, userImageUpdate } from "@/app/actions/user-actions";
import ModalChangePassword from "@/components/modals/ModalChangePassword";
import FormTemplate, {
  ViewGroup,
  ViewGroupStack,
} from "@/components/templates/FormTemplate";
import { Partner, User } from "@/generate/prisma";
import { UserWithPartner } from "@/libs/definitions";
import ImageSource from "@/ui/ImageSource";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

type TInputs = Omit<
  User & Partner,
  "password" | "id" | "createdAt" | "updatedAt" | "displayName"
>;

interface IInputs extends TInputs {
  name: string;
}

type TDataInputs = {
  name: string;
  email: string | null;
};

function ProfileFormView({ user }: { user: UserWithPartner }) {
  const originalValuesRef = useRef<TDataInputs | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<IInputs>({
    defaultValues: {
      name: user.partner.name,
      email: user.partner.email,
      phone: user.partner.phone,
      street: user.partner.street,
      secondStreet: user.partner.secondStreet,
      town: user.partner.town,
      city: user.partner.city,
      province: user.partner.province,
      country: user.partner.country,
      zip: user.partner.zip,
      vat: user.partner.vat,
      partnerId: user.partnerId,
    },
  });

  const [modalChangePassword, setModalChangePassword] = useState(false);

  const onSubmit: SubmitHandler<IInputs> = async (data) => {
    const newData = {
      name: data.name,
      email: data.email,
      login: user.login,
    };

    const res = await updateUserProfile(newData);

    if (!res.success) {
      toast.error(res.message);
      return;
    }
  };

  const handleRevert = () => {
    if (originalValuesRef.current) {
      reset({
        name: originalValuesRef.current.name,
        email: originalValuesRef.current.email,
      });
    }
  };

  const handleChangePassword = () => {
    if (user.id) {
      setModalChangePassword(true);
    }
  };

  const handleChangeImage = async (imageId: string | null) => {
    await userImageUpdate({ imageId, id: user.partner.id });
  };

  useEffect(() => {
    if (user) {
      originalValuesRef.current = {
        name: user.partner.name,
        email: user.partner.email,
      };
    }
  }, [user]);

  return (
    <>
      <FormTemplate
        onSubmit={handleSubmit(onSubmit)}
        isDirty={isDirty}
        revert={handleRevert}
        disableForm={isSubmitting}
        notCreate={true}
        name={user.partner.name}
        viewForm=""
        formActions={[
          {
            string: "Cambiar contraseña",
            action: handleChangePassword,
          },
        ]}
      >
        <ViewGroup>
          <Form.Group className="text-center mb-3">
            <ImageSource
              editable
              remove
              entityType="users"
              sourceId={user.partner.imageId}
              width={125}
              height={125}
              getImageId={handleChangeImage}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              {...register("name", { required: "Este campo es requerido" })}
              type="text"
              size="sm"
              autoComplete="off"
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo:</Form.Label>
            <Form.Control
              {...register("email")}
              type="text"
              size="sm"
              autoComplete="off"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contacto:</Form.Label>
            <Form.Text className="text-capitalize">
              {" "}
              {user.partner.name}
            </Form.Text>
          </Form.Group>
        </ViewGroup>
        <ViewGroup disabled title="Información personal">
          <Form.Group className="mb-3">
            <Form.Label>Teléfono:</Form.Label>
            <Form.Control
              {...register("phone")}
              type="text"
              size="sm"
              autoComplete="off"
            />
          </Form.Group>
          <ViewGroupStack>
            <Form.Group className="mb-3">
              <Form.Label>Calle:</Form.Label>
              <Form.Control
                {...register("street")}
                type="text"
                size="sm"
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>C.P.</Form.Label>
              <Form.Control
                {...register("zip")}
                type="text"
                size="sm"
                autoComplete="off"
              />
            </Form.Group>
          </ViewGroupStack>
          <Form.Group className="mb-3">
            <Form.Label>Entre calles:</Form.Label>
            <Form.Control
              {...register("secondStreet")}
              type="text"
              size="sm"
              autoComplete="off"
            />
          </Form.Group>
          <ViewGroupStack>
            <Form.Group className="mb-3">
              <Form.Label>Colonia:</Form.Label>
              <Form.Control
                {...register("town")}
                type="text"
                size="sm"
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ciudad:</Form.Label>
              <Form.Control
                {...register("city")}
                type="text"
                size="sm"
                autoComplete="off"
              />
            </Form.Group>
          </ViewGroupStack>
          <ViewGroupStack>
            <Form.Group className="mb-3">
              <Form.Label>Estado:</Form.Label>
              <Form.Control
                {...register("province")}
                type="text"
                size="sm"
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>País:</Form.Label>
              <Form.Control
                {...register("country")}
                type="text"
                size="sm"
                autoComplete="off"
              />
            </Form.Group>
          </ViewGroupStack>
        </ViewGroup>
      </FormTemplate>
      <ModalChangePassword
        show={modalChangePassword}
        onHide={() => setModalChangePassword(false)}
        modelId={user.id}
      />
    </>
  );
}

export default ProfileFormView;
