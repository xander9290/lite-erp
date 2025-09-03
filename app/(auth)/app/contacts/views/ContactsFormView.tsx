"use client";

import { userImageUpdate } from "@/app/actions/user-actions";
import FormTemplate, {
  FormBook,
  FormPage,
  ViewGroup,
  ViewGroupStack,
} from "@/components/templates/FormTemplate";
import { Partner, User } from "@/generate/prisma";
import { PartnerContacts } from "@/libs/definitions";
import { formatDate } from "@/libs/helpers";
import useFields from "@/ui/fields/useFields";
import ImageSource from "@/ui/ImageSource";
import { useEffect, useRef } from "react";
import { Container, Form, Row } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { createPartner, updatePartner } from "../actions";
import { useModals } from "@/context/ModalContext";
import { useRouter } from "next/navigation";
import KanbanContainer from "@/ui/KanbanContainer";

export type PartnernInputs = Omit<
  PartnerContacts,
  "displayName" | "id" | "Image" | "userAgent"
>;
{
}
function ContactsFormView({
  partner,
  users,
  displayType,
  modelId,
  partners,
}: {
  partner: PartnerContacts | null;
  users: User[] | null;
  displayType: string;
  modelId: string;
  partners: Partner[];
}) {
  const { modalError } = useModals();
  const { Entry, PageContent, Boolean, Relation, Selection } = useFields({
    accessModel: "partners",
  });

  const originalValuesRef = useRef<PartnernInputs | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
    control,
  } = useForm<PartnernInputs>();

  const onSubmit: SubmitHandler<PartnernInputs> = async (data) => {
    if (modelId && modelId === "null") {
      const res = await createPartner({ data });
      if (!res.success) {
        modalError(res.message);
        return;
      }
      router.replace(
        `/app/contacts?view_mode=form&id=${res.data?.id}&type=internal`
      );
    } else {
      const res = await updatePartner({ id: modelId, data });
      if (!res.success) {
        modalError(res.message);
        return;
      }
    }
  };

  const handleRevert = () => {
    const values = originalValuesRef.current;
    reset(values || {});
  };

  const handleChangeImage = async (imageId: string | null) => {
    await userImageUpdate({ imageId, id: partner?.id || "" });
  };

  useEffect(() => {
    if (partner) {
      const values: PartnernInputs = {
        name: partner?.name,
        email: partner?.email,
        phone: partner?.phone,
        street: partner?.street,
        secondStreet: partner?.secondStreet,
        town: partner?.town,
        city: partner?.city,
        province: partner?.province,
        country: partner?.country,
        zip: partner?.zip,
        vat: partner?.vat,
        state: partner.state,
        active: partner.active,
        userId: partner.userId,
        // @ts-expect-error tipado de fecha
        createdAt: formatDate(partner.createdAt),
        // @ts-expect-error tipado de fecha
        updatedAt: formatDate(partner.updatedAt),
        imageId: partner.Image?.id || null,
        createBy: partner.createBy,
        displayType: displayType,
        relatedUser: partner.relatedUser,
        parentId: partner.parentId,
      };
      reset(values);
      originalValuesRef.current = values;
      console.log(partners);
    } else {
      reset({
        name: "",
        email: null,
        phone: null,
        street: null,
        secondStreet: null,
        town: null,
        city: null,
        province: null,
        country: null,
        zip: null,
        vat: null,
        state: null,
        active: false,
        userId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        imageId: null,
        createBy: null,
        displayType: displayType,
        parentId: null,
      });
      originalValuesRef.current = null;
    }
  }, [partner]);

  return (
    <>
      <FormTemplate
        onSubmit={handleSubmit(onSubmit)}
        isDirty={isDirty}
        revert={handleRevert}
        disableForm={isSubmitting}
        viewForm="/app/contacts?view_mode=form&id=null&type=internal"
        entityName="partners"
        withActivity={true}
        name={partner?.name}
        active={partner?.active ?? true}
      >
        <ViewGroup>
          <Entry label="Nombre:" fieldName="name" register={register("name")} />
          <Entry
            label="Calle:"
            fieldName="street"
            register={register("street")}
          />
          <Entry
            label="Entre calles:"
            fieldName="secondStreet"
            register={register("secondStreet")}
          />
          <ViewGroupStack>
            <Entry
              label="Colonia:"
              fieldName="town"
              register={register("town")}
            />
            <Entry
              label="Código Postal:"
              fieldName="zip"
              register={register("zip")}
            />
          </ViewGroupStack>
          <ViewGroupStack>
            <Entry
              label="Ciudad:"
              fieldName="city"
              register={register("city")}
            />
            <Entry
              label="Estado:"
              fieldName="province"
              register={register("province")}
            />
          </ViewGroupStack>
        </ViewGroup>
        <ViewGroup>
          <Form.Group className="mb-2 text-center">
            <ImageSource
              editable
              remove
              entityType="users"
              sourceId={partner?.imageId || null}
              width={120}
              height={120}
              getImageId={handleChangeImage}
            />
          </Form.Group>
          <Entry
            type="email"
            register={register("email")}
            label="Correo:"
            fieldName="email"
          />
          <Entry
            register={register("phone")}
            label="Teléfono:"
            fieldName="phone"
          />
          <Entry register={register("vat")} label="R.F.C." fieldName="vat" />
          <Boolean
            type="switch"
            register={register("active")}
            fieldName="active"
            label="Activo"
          />
        </ViewGroup>
        <FormBook dKey="children">
          <FormPage title="Direcciones y Contactos" eventKey="children">
            <PageContent fieldName="children">
              <Container fluid>
                <Row className="g-2 py-2">
                  {partner?.children?.map((child) => (
                    <KanbanContainer
                      key={child.id}
                      formView={`/app/contacts?view_mode=form&id=${child.id}&type=${child.displayType}`}
                    >
                      <div className="d-flex gap-1" style={{ height: "125px" }}>
                        <div style={{ minWidth: "60%" }} className="text-start">
                          <h6
                            title={child.name}
                            className="card-title fw-bold text-truncate"
                          >
                            {child.name}
                          </h6>
                          <div style={{ fontSize: "0.8rem" }}>
                            <p className="card-text text-uppercase my-1">
                              {child.street} {child.town} {child.province}{" "}
                              {partner.city}
                            </p>
                            {child.phone && (
                              <p className="card-text my-1">{child.phone}</p>
                            )}
                            <p>{child.displayType}</p>
                          </div>
                        </div>
                      </div>
                    </KanbanContainer>
                  ))}
                </Row>
              </Container>
            </PageContent>
          </FormPage>
          <FormPage title="Venta y Compra" eventKey="salePurchase">
            <PageContent fieldName="salePurchase">
              <ViewGroup title="Ventas">
                <Relation
                  register={register("userId")}
                  options={users || []}
                  label="Agente:"
                  fieldName="userId"
                  control={control}
                  callBackMode="id"
                />
              </ViewGroup>
            </PageContent>
          </FormPage>
          <FormPage title="Otra información" eventKey="otherInfo">
            <PageContent fieldName="otherInfo">
              <ViewGroup>
                <Relation
                  options={users || []}
                  callBackMode="id"
                  label="Creado por:"
                  register={register("createBy.id")}
                  fieldName="createdBy"
                  control={control}
                  disabled
                />
                <Entry
                  disabled
                  label="Fecha de creación:"
                  fieldName="createdAt"
                  register={register("createdAt")}
                  type="datetime"
                />
                <Entry
                  disabled
                  label="Última actualización:"
                  fieldName="updatedAt"
                  register={register("updatedAt")}
                  type="datetime"
                />
              </ViewGroup>
              <ViewGroup>
                <Selection
                  register={register("displayType")}
                  options={[
                    { label: "Cliente", value: "customer" },
                    { label: "Proveedor", value: "supplier" },
                    { label: "Empleado", value: "internal" },
                    { label: "Entrega", value: "delivery" },
                    { label: "Contacto", value: "contact" },
                    { label: "Dirección", value: "address" },
                  ]}
                  label="Tipo de contacto:"
                  fieldName="displayType"
                />
                <Relation
                  register={register("parentId")}
                  options={partners || []}
                  label="Contacto relacionado:"
                  fieldName="parentId"
                  control={control}
                  callBackMode="id"
                />
                <Entry
                  register={register("relatedUser.displayName")}
                  fieldName="relatedUser"
                  label="Usuario relacionado:"
                  disabled
                />
              </ViewGroup>
            </PageContent>
          </FormPage>
        </FormBook>
      </FormTemplate>
    </>
  );
}

export default ContactsFormView;
