"use server";

import { ActionResponse, UserWithPartner } from "@/libs/definitions";
import { db } from "@/libs/core/db/ExtendedPrisma";
import { prisma } from "@/libs/prisma";

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
