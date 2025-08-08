"use server";
import { Model, ModelFieldLine } from "@/generate/prisma";
import { db } from "@/libs/core/db/ExtendedPrisma";
import { ActionResponse } from "@/libs/definitions";
import { prisma } from "@/libs/prisma";

export interface ModelsWithAttrs extends Model {
  fieldLines: ModelFieldLine[];
}

export const readModels = async ({
  skip,
  perPage,
  search,
  filter = "name",
}: {
  skip: number;
  perPage: number;
  search: string;
  filter: string;
}): Promise<ActionResponse<ModelsWithAttrs[]>> => {
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
};

export const readModel = async ({
  id,
}: {
  id: string | null;
}): Promise<ActionResponse<ModelsWithAttrs>> => {
  try {
    if (!id) {
      return {
        success: false,
        message: "ID NOT DEFINED",
      };
    }

    const model = await prisma.model.findUnique({
      where: {
        id,
      },
      include: {
        fieldLines: true,
      },
    });

    if (!model) {
      return {
        success: false,
        message: "MODEL NOT FOUND",
      };
    }

    return {
      success: true,
      message: "MODEL WAS FOUND",
      data: model,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  }
};

export const createModel = async ({
  name,
  label,
  active,
  fieldLines,
}: {
  name: string;
  label: string;
  active: boolean;
  fieldLines: ModelFieldLine[] | null;
}): Promise<ActionResponse<string>> => {
  try {
    const newModel = await prisma.model.create({
      data: {
        name,
        label,
        displayName: `[${name}] ${label}`,
        active,
        fieldLines: {
          create: fieldLines?.map((field) => ({
            name,
            active,
            type,
            require,
          })),
        },
      },
    });

    if (!newModel) {
      return {
        success: false,
        message: "MODEL NOT CREATED",
      };
    }

    return {
      success: true,
      message: "MODEL WAS CREATED",
      data: newModel.id,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  }
};
