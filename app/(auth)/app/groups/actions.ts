"use server";

import { Group, GroupLine, User } from "@/generate/prisma";
import { db } from "@/libs/core/db/ExtendedPrisma";
import { ActionResponse } from "@/libs/definitions";
import { prisma } from "@/libs/prisma";

export interface GroupWithAttrs extends Group {
  users: User[];
  groupLines: GroupLine[];
  createBy: User | null;
}

export async function fetchGroups({
  skip,
  perPage,
  search,
  filter = "name",
}: {
  skip: number;
  perPage: number;
  search: string;
  filter: string;
}): Promise<ActionResponse<GroupWithAttrs[]>> {
  try {
    const groups: GroupWithAttrs[] = await db.find(
      "group",
      ["or", [filter, "ilike", search]],
      {
        skip: (skip - 1) * perPage,
        take: perPage,
        orderBy: { id: "asc" },
        include: {
          users: true,
          groupLines: true,
          createBy: true,
        },
      }
    );

    if (!groups) {
      return {
        success: false,
        message: "Error al cargar grupos",
      };
    }
    return {
      success: true,
      message: "Grupos encontrados",
      data: groups,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  }
}

export async function fetchGroup(
  id: string
): Promise<ActionResponse<GroupWithAttrs>> {
  try {
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        users: true,
        groupLines: true,
        createBy: true,
      },
    });

    if (!group) {
      return {
        success: false,
        message: "Grupo no encontrado",
      };
    }

    return {
      success: true,
      message: "Grupo encontrado",
      data: group as GroupWithAttrs,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  } finally {
    console.log("Fetch group completed");
  }
}
