"use server";

import { ActionResponse, UserWithPartner } from "@/libs/definitions";
import { db } from "@/libs/core/db/ExtendedPrisma";
import { prisma } from "@/libs/prisma";
import { auth } from "@/libs/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { User } from "@/generate/prisma";
import { Domain } from "@/libs/core/db/domainParser";

export async function fetchUsers({
  skip,
  perPage,
  search,
  filter = "name",
}: {
  skip: number;
  perPage: number;
  search: string;
  filter: string;
}): Promise<ActionResponse<UserWithPartner[]>> {
  try {
    const users: UserWithPartner[] = await db.find(
      "user",
      ["or", [filter, "ilike", search]],
      {
        skip: (skip - 1) * perPage,
        take: perPage,
        orderBy: { id: "asc" },
        include: {
          partner: {
            include: {
              Image: true,
              createBy: true,
            },
          },
          group: true,
        },
      }
    );

    return {
      success: false,
      message: "SUCCESS",
      data: users,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error as string,
    };
  }
}

export async function fetchUser({
  id,
}: {
  id: string | null;
}): Promise<ActionResponse<UserWithPartner>> {
  try {
    if (!id) {
      return {
        success: false,
        message: "ID NOT DEFINED",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        partner: {
          include: {
            Image: true,
            createBy: true,
            relatedUser: true,
          },
        },
        group: true,
        partenerLeads: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "USER NOT FOUND",
      };
    }

    return {
      success: true,
      message: "Usuario encontrado",
      data: user,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "ERROR: " + error,
    };
  }
}

export async function createUser({
  name,
  login,
  groupId,
  email,
}: {
  name: string;
  login: string;
  groupId: string | null;
  email: string | null;
}): Promise<ActionResponse<unknown>> {
  try {
    const session = await auth();

    const hashedPassword = await bcrypt.hash("1234", 10);

    const newPartner = await prisma.partner.create({
      data: {
        name,
        email,
        displayName: name,
        createUid: session?.user.id,
        relatedUser: {
          create: {
            name,
            displayName: `[${login}] ${name}`,
            login,
            password: hashedPassword,
            groupId,
          },
        },
      },
      include: {
        relatedUser: true,
      },
    });

    if (!newPartner) {
      return {
        success: false,
        message: "USER NOT CREATED",
      };
    }

    await prisma.activity.create({
      data: {
        string: `Ha creado el usuario ${name}`,
        entityName: "users",
        entityId: newPartner.relatedUser?.id,
        userId: session?.user.id,
      },
    });

    return {
      success: true,
      message: "USER CREATED SUCCESSFULLY",
      data: newPartner.relatedUser?.id,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "ERROR: " + error,
    };
  }
}

export async function updateUser({
  name,
  login,
  groupId,
  email,
  partnerId,
}: {
  name: string;
  login: string;
  groupId: string | null;
  email: string | null;
  partnerId: string;
}): Promise<ActionResponse<unknown>> {
  try {
    const changedPartner = await prisma.partner.update({
      where: {
        id: partnerId,
      },
      data: {
        email,
        name,
        displayName: name,
        relatedUser: {
          update: {
            name,
            displayName: `[${login}] ${name}`,
            login,
            groupId,
          },
        },
      },
    });

    if (!changedPartner) {
      return {
        success: false,
        message: "PARTNER COULD NOT BE UPDATED",
      };
    }

    revalidatePath("/app/users");

    return {
      success: true,
      message: "Se ha actualizado el usuario",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  }
}

export async function userMany2one({
  domain,
}: {
  domain: Domain;
}): Promise<ActionResponse<User[]>> {
  try {
    const users = await db.find("user", domain, {
      take: 10,
      orderBy: { name: "asc" },
    });

    if (!users) {
      return {
        success: false,
        message: "No se encontraron usuarios",
      };
    }

    return {
      success: true,
      message: "Usuarios encontrados",
      data: users,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  }
}
