"use server";

import { ActionResponse, PartnerContacts } from "@/libs/definitions";
import { prisma } from "@/libs/prisma";

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
