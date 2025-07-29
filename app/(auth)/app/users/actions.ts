"use server";

import { ActionResponse, UserWithPartner } from "@/libs/definitions";
import { db } from "@/libs/core/db/ExtendedPrisma";

export async function fetchUsers({
  skip,
  perPage,
  search,
}: {
  skip: number;
  perPage: number;
  search: string;
}): Promise<ActionResponse<UserWithPartner[]>> {
  try {
    const users: UserWithPartner[] = await db.find(
      "user",
      ["or", ["login", "ilike", search], ["name", "ilike", search]],
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
