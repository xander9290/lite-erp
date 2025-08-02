"use server";

import { Group, GroupLine, User } from "@/generate/prisma";
import { ActionResponse } from "@/libs/definitions";

export interface GroupWithAttrs extends Group {
  users: User;
  groupLines: GroupLine[];
  createBy: User | null;
}

export async function fetchGroups(): Promise<ActionResponse<GroupWithAttrs[]>> {
  try {
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  }
}
