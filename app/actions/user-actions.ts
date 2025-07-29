"use server";

import { auth } from "@/libs/auth";
import { db } from "@/libs/core/db/ExtendedPrisma";
import { ActionResponse } from "@/libs/definitions";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";

export async function changeUserPassword({
  currentPassword,
  newPassword,
  modelId,
}: {
  currentPassword: string;
  newPassword: string;
  modelId: string | null;
}): Promise<ActionResponse<unknown>> {
  try {
    if (!modelId) {
      return {
        success: false,
        message: "ID NOT DEFINED",
      };
    }

    const getUser = await db.find("user", ["and", ["id", "=", modelId]]);

    if (getUser.length === 0) {
      return {
        success: false,
        message: "USER NOT FOUND",
      };
    }

    const isMatch = await bcrypt.compare(currentPassword, getUser[0].password);

    if (!isMatch) {
      return {
        success: false,
        message: "Contraseña actual incorrecta",
      };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await db.update("user", getUser[0].id, {
      password: hashedNewPassword,
    });

    if (!updatedUser) {
      return {
        success: false,
        message: "Error al actualizar la contraseña",
      };
    }

    return {
      success: true,
      message: "Contraseña actualizada correctamente",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: "Error al cambiar la contraseña",
    };
  }
}

export async function updateUserProfile({
  name,
  email,
  login,
}: {
  name: string;
  email: string | null;
  login: string;
}): Promise<ActionResponse<unknown>> {
  try {
    const session = await auth();
    const changedUser = await prisma.user.update({
      where: {
        id: session?.user.id,
      },
      data: {
        displayName: `[${login}] ${name}`,
        name,
        partner: {
          update: {
            email,
            name,
          },
        },
      },
    });

    if (!changedUser) {
      return {
        success: false,
        message: "Error al editar usuario",
      };
    }

    return {
      success: true,
      message: "Datos actualizados",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: "Error al cambiar la contraseña",
    };
  }
}

export async function userImageUpdate({
  imageId,
  id,
}: {
  imageId: string | null;
  id: string;
}): Promise<ActionResponse<unknown>> {
  try {
    const changedUser = await prisma.partner.update({
      where: {
        id,
      },
      data: {
        imageId,
      },
    });

    if (!changedUser) {
      return {
        success: false,
        message: "Error al actualizar la url de la imagen",
      };
    }

    return {
      success: true,
      message: "Se ha actualizado la url de la imagen",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error al actualizar imageUrl (catch)",
    };
  }
}
