"use server";
import { Model, ModelFieldLine } from "@/generate/prisma";
import { Domain } from "@/libs/core/db/domainParser";
import { db } from "@/libs/core/db/ExtendedPrisma";
import { ActionResponse } from "@/libs/definitions";
import { prisma } from "@/libs/prisma";
import { revalidatePath } from "next/cache";

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

export async function createFieldLine({
  name,
  label,
  type,
  required,
  modelId,
}: {
  name: string;
  label: string;
  type: string;
  required: boolean;
  modelId: string | null;
}): Promise<ActionResponse<ModelFieldLine>> {
  if (!modelId) {
    return {
      success: false,
      message: "ID MODEL MISSING",
    };
  }
  try {
    const newType = await prisma.modelFieldLine.create({
      data: {
        name,
        label,
        displayName: `[${name}] ${label}`,
        type,
        required,
        model: {
          connect: { id: modelId },
        },
      },
      include: {
        model: true,
      },
    });

    if (!newType) {
      return {
        success: false,
        message: "FIELD NOT CREATED",
      };
    }

    return {
      success: true,
      message: "FIELD WAS CREATED",
      data: newType,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "ERROR: " + error,
    };
  }
}

export async function fetchField({
  id,
}: {
  id: string | null;
}): Promise<ActionResponse<ModelFieldLine>> {
  try {
    if (!id) {
      return {
        success: false,
        message: "ID NOT DEFINED",
      };
    }

    const field = await prisma.modelFieldLine.findUnique({
      where: {
        id,
      },
    });

    if (!field) {
      return {
        success: false,
        message: "RECORD NOT FOUND",
      };
    }

    return {
      success: true,
      message: "RECORD FOUND",
      data: field,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  }
}

export async function updateField({
  id,
  name,
  label,
  type,
  required,
}: {
  id: string | null;
  name: string;
  label: string;
  type: string;
  required: boolean;
}): Promise<ActionResponse<boolean>> {
  try {
    if (!id) {
      return {
        success: false,
        message: "ID NOT DEFINED",
      };
    }

    const changedField = await prisma.modelFieldLine.update({
      where: {
        id,
      },
      data: {
        name,
        label,
        type,
        required,
        displayName: `[${name}] ${label}`,
      },
    });

    if (!changedField) {
      return {
        success: false,
        message: "RECORD COULD NOT BE CHANGED",
      };
    }
    revalidatePath("/app/models");
    return {
      success: true,
      message: "RECORD CHANGED",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  }
}

export async function deleteField({
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

    await prisma.modelFieldLine.delete({
      where: {
        id,
      },
    });

    revalidatePath("/app/models");

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

export async function getModelsMany2one({
  domain,
}: {
  domain: Domain;
}): Promise<ActionResponse<Model[]>> {
  try {
    const models: Model[] = await db.find("model", domain);

    if (!models) {
      return {
        success: false,
        message: "MODELS NOT FETCHED",
      };
    }

    return {
      success: true,
      message: "FETCHED MODELS",
      data: models,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  }
}

export async function getFieldsMany2one({
  domain,
}: {
  domain: Domain;
}): Promise<ActionResponse<ModelFieldLine[]>> {
  try {
    const fields: ModelFieldLine[] = await db.find("modelFieldLine", domain);
    return {
      success: true,
      message: "FIELDS WAS FOUND",
      data: fields,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error: " + error,
    };
  }
}
