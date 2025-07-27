"use server";

import { signIn } from "@/libs/auth";
import { ActionResponse } from "@/libs/definitions";

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

    return {
      success: true,
      message: "Se ha iniciado la sesión",
    };
  } catch (error: unknown) {
    console.log(error);
    return {
      success: false,
      message: "Error al validar credenciales @try-catch",
    };
  }
};
