"use server";

import { ActionResponse, PartnerContacts } from "@/libs/definitions";
import { prisma } from "@/libs/prisma";
import { PartnernInputs } from "./views/ContactsFormView";
import { auth } from "@/libs/auth";
import { revalidatePath } from "next/cache";

export async function fetchParterById({
  id,
}: {
  id: string | null;
}): Promise<ActionResponse<PartnerContacts | null>> {
  try {
    if (!id) {
      return {
        success: false,
        message: "PARTNER ID NOT DEFINED",
      };
    }

    const partner = await prisma.partner.findUnique({
      where: {
        id,
      },
      include: {
        createBy: true,
        relatedUser: true,
        Image: true,
        userAgent: true,
        children: true,
      },
    });

    return {
      success: true,
      message: "PARTNER WAS FOUND",
      data: partner,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  }
}

export async function createPartner({
  data,
}: {
  data: PartnernInputs;
}): Promise<ActionResponse<PartnerContacts>> {
  try {
    const session = await auth();
    const sessionId = session?.user.id as unknown as string;

    const newPartner = await prisma.partner.create({
      data: {
        name: data.name,
        displayName: `[${data.phone}] ${data.name}`,
        email: data.email || null,
        phone: data.phone || null,
        street: data.street || null,
        secondStreet: data.secondStreet || null,
        town: data.town || null,
        city: data.city || null,
        province: data.province || null,
        country: data.country || null,
        zip: data.zip ? parseInt(data.zip as unknown as string) : null,
        vat: data.vat || null,
        state: data.state || null,
        displayType: data.displayType || "internal",
        active: data.active ?? true,
        userId: data.userId || null,
        parentId: data.parentId || null,
        createUid: sessionId,
      },
      include: {
        createBy: true,
        userAgent: true,
        Image: true,
        relatedUser: true,
        children: true,
      },
    });

    if (!newPartner) {
      throw new Error("Error al crear contacto");
    }

    revalidatePath("/app/contacts");

    return {
      success: true,
      message: "CONTRACT CREATED SUCCESSFULLY",
      data: newPartner,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function updatePartner({
  id,
  data,
}: {
  id: string | null;
  data: PartnernInputs;
}): Promise<ActionResponse<PartnerContacts>> {
  try {
    if (!id) {
      throw new Error("MODEL ID NOT DEFINED");
    }

    const record = await prisma.partner.findUnique({ where: { id } });

    if (record?.displayType === "customer" && data.parentId !== null) {
      throw new Error("El tipo cliente no puede ser asignado como contacto");
    }

    const newPartner = await prisma.partner.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        displayName: `[${data.phone}] ${data.name}`,
        email: data.email || null,
        phone: data.phone || null,
        street: data.street || null,
        secondStreet: data.secondStreet || null,
        town: data.town || null,
        city: data.city || null,
        province: data.province || null,
        country: data.country || null,
        zip: data.zip ? parseInt(data.zip as unknown as string) : null,
        vat: data.vat || null,
        state: data.state || null,
        displayType: data.displayType || "internal",
        active: data.active ?? true,
        userId: data.userId || null,
        parentId: data.parentId || null,
      },
      include: {
        createBy: true,
        userAgent: true,
        Image: true,
        relatedUser: true,
        children: true,
      },
    });

    if (!newPartner) {
      throw new Error("Error al editar contacto");
    }

    return {
      success: true,
      message: "CONTRACT CREATED SUCCESSFULLY",
      data: newPartner,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
