"use server";

import { ActivityWithUser } from "@/components/templates/ActivityTemplate";
import { auth } from "@/libs/auth";
import { db } from "@/libs/core/db/ExtendedPrisma";
import { ActionResponse } from "@/libs/definitions";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";

// Add finally blocks with console.log for each function

// changeUserPassword
// (already has try/catch, add finally)
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
  } finally {
    console.log("Function changeUserPassword execute");
  }
}

// changePassword
export async function changePassword({
  newPassword,
  modelId,
}: {
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

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const changedUser = await prisma.user.update({
      where: {
        id: modelId,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    if (!changedUser) {
      return {
        success: false,
        message: "Error al cambiar la contraseña",
      };
    }
    return {
      success: true,
      message: "Contraseña actualizada correctamente",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  } finally {
    console.log("Function changePassword execute");
  }
}

// updateUserProfile
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
            displayName: name,
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
  } finally {
    console.log("Function updateUserProfile execute");
  }
}

// userImageUpdate
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
  } finally {
    console.log("Function userImageUpdate execute");
  }
}

// fetchActivity
export async function fetchActivity({
  entityName,
  entityId,
}: {
  entityName: string | null;
  entityId: string | null;
}): Promise<ActionResponse<ActivityWithUser[]>> {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        entityName,
        entityId,
      },
      include: {
        createBy: {
          include: {
            partner: {
              include: {
                Image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!activities) {
      return {
        success: false,
        message: "Error al cargar actividades",
      };
    }

    return {
      success: true,
      message: "Actividades encontradas",
      data: activities,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  } finally {
    console.log("Function fetchActivity execute");
  }
}

// createActivity
export async function createActivity({
  entityId,
  entityName,
  string,
}: {
  entityId: string;
  entityName: string;
  string: string;
}): Promise<ActionResponse<ActivityWithUser | null>> {
  try {
    const session = await auth();
    const newActivity = await prisma.activity.create({
      data: {
        string,
        entityId,
        entityName,
        userId: session?.user.id,
      },
      include: {
        createBy: {
          include: {
            partner: {
              include: {
                Image: true,
              },
            },
          },
        },
      },
    });

    if (!newActivity) {
      return {
        success: false,
        message: "NOTE NOT CREATED",
      };
    }

    return {
      success: true,
      message: "NOTE HAS BEEN CREATED",
      data: newActivity,
    };
  } catch (error: unknown) {
    console.log(error);
    return {
      success: false,
      message: "NOTE NOT CREATED: " + error,
    };
  } finally {
    console.log("Function createActivity execute");
  }
}
