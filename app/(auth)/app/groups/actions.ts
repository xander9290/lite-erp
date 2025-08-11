"use server";

import { Group, GroupLine, User } from "@/generate/prisma";
import { auth } from "@/libs/auth";
import { db } from "@/libs/core/db/ExtendedPrisma";
import { ActionResponse } from "@/libs/definitions";
import { prisma } from "@/libs/prisma";
import { revalidatePath } from "next/cache";

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

export async function createGroup({
  name,
  userIds,
}: {
  name: string;
  userIds: User[];
}): Promise<ActionResponse<GroupWithAttrs>> {
  try {
    const session = await auth();
    const newGroup = await prisma.group.create({
      data: {
        name,
        displayName: name,
        createBy: {
          connect: { id: session?.user.id },
        },
        users: {
          connect: userIds.map((user) => ({ id: user.id })),
        },
      },
      include: {
        users: true,
        createBy: true,
        groupLines: true,
      },
    });

    return {
      success: true,
      message: "Se ha creado el grupo",
      data: newGroup,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "ERROR: " + error,
    };
  }
}

export async function updateGroup({
  modelId,
  userIds,
  name,
  active,
}: {
  modelId: string;
  userIds: User[];
  name: string;
  active: boolean;
}): Promise<ActionResponse<string>> {
  try {
    const newGroup = await prisma.group.update({
      where: {
        id: modelId,
      },
      data: {
        name,
        displayName: name,
        active,
        users: {
          connect: userIds.map((user) => ({ id: user.id })),
        },
      },
    });

    return {
      success: true,
      message: "Se ha editado el grupo",
      data: newGroup.id,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "ERROR: " + error,
    };
  }
}

// export async function addUser({
//   groupId,
//   userId,
// }: {
//   groupId: string | null;
//   userId: string | null;
// }): Promise<ActionResponse<unknown>> {
//   try {
//     const group = await prisma.group.update({
//       where: { id: groupId || "" },
//       data: {
//         users: {
//           connect: { id: userId || "" },
//         },
//       },
//     });

//     if (!group) {
//       return {
//         success: false,
//         message: "Grupo no encontrado",
//       };
//     }

//     revalidatePath("/app/groups");

//     return {
//       success: true,
//       message: "Usuario añadido al grupo correctamente",
//     };
//   } catch (error: unknown) {
//     return {
//       success: false,
//       message: "Error al añadir usuario al grupo: " + error,
//     };
//   }
// }

export async function removeUser({
  groupId,
  userId,
}: {
  groupId: string | null;
  userId: string | null;
}): Promise<ActionResponse<unknown>> {
  try {
    const group = await prisma.group.update({
      where: { id: groupId || "" },
      data: {
        users: {
          disconnect: { id: userId || "" },
        },
      },
    });

    if (!group) {
      return {
        success: false,
        message: "Grupo no encontrado",
      };
    }

    revalidatePath("/app/groups");

    return {
      success: true,
      message: "Usuario eliminado del grupo correctamente",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error al eliminar usuario del grupo: " + error,
    };
  }
}

export async function createGroupLine({
  modelId,
  entityName,
  fieldName,
  notCreate,
  noEdit,
  invisible,
  required,
  readonly,
}: {
  modelId: string | null;
  entityName: string;
  fieldName: string;
  notCreate: boolean;
  noEdit: boolean;
  invisible: boolean;
  required: boolean;
  readonly: boolean;
}): Promise<ActionResponse<GroupLine | null>> {
  try {
    if (!modelId) {
      return {
        success: false,
        message: "ID NOT DEFINED",
      };
    }

    const session = await auth();

    const newAccess = await prisma.groupLine.create({
      data: {
        entityName,
        fieldName,
        notCreate,
        noEdit,
        invisible,
        required,
        readonly,
        createUid: session?.user.id,
        Group: {
          connect: { id: modelId },
        },
      },
    });

    if (!newAccess) {
      return {
        success: false,
        message: "RECORD WAS NOT CREATED",
      };
    }

    return {
      success: true,
      message: "RECORD WAS CREATED",
      data: newAccess,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  }
}

export async function deleteGroupLine({
  id,
}: {
  id: string | null;
}): Promise<ActionResponse<boolean>> {
  try {
    if (!id) {
      return {
        success: false,
        message: "ID NOT DEFINED",
      };
    }

    const deletedRecord = await prisma.groupLine.delete({
      where: {
        id,
      },
    });

    if (!deletedRecord) {
      return {
        success: false,
        message: "RECORD WAS NOT DELETED",
      };
    }

    revalidatePath("/app/groups");

    return {
      success: true,
      message: "RECORD WAS DELETED",
      data: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  }
}
