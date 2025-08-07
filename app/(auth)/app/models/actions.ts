"use server";

import { Model, ModelFieldLine } from "@/generate/prisma";
import { db } from "@/libs/core/db/ExtendedPrisma";
import { ActionResponse } from "@/libs/definitions";

export interface ModelsWithAttrs extends Model {
  fieldLines: ModelFieldLine[];
}

export async function fetchModels({
  skip,
  perPage,
  search,
  filter = "name",
}: {
  skip: number;
  perPage: number;
  search: string;
  filter: string;
}): Promise<ActionResponse<ModelsWithAttrs[]>> {
  try {
    const models: ModelsWithAttrs[] = await db.find(
      "model",
      ["or", [filter, "ilike", search]],
      {
        skip: (skip - 1) * perPage,
        take: perPage,
        orderBy: { id: "asc" },
        include: {
          fieldLines: true,
        },
      }
    );

    if (!models) {
      return {
        success: false,
        message: "Error al cargar modelos",
      };
    }
    return {
      success: true,
      message: "Modelos encontrados",
      data: models,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  }
}

async function fetchModel() {}

async function createModel() {}
