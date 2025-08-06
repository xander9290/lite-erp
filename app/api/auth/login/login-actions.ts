"use server";

import { signIn } from "@/libs/auth";
import { ActionResponse } from "@/libs/definitions";
import { prisma } from "@/libs/prisma";

export const userLogin = async ({
  login,
  password,
}: {
  login: string;
  password: string;
}): Promise<ActionResponse<unknown>> => {
  try {
    await signIn("credentials", {
      email: login,
      password,
      redirect: false,
    });

    const user = await prisma.user.findUnique({
      where: {
        login,
      },
    });

    if (!user?.active) {
      return {
        success: false,
        message: "Usuario inactivo",
      };
    }

    return {
      success: true,
      message: "Se ha iniciado la sesión",
    };
  } catch (error: unknown) {
    console.log(error);
    return {
      success: false,
      message: "Credenciales no válidas",
    };
  }
};
