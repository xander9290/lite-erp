-- CreateTable
CREATE TABLE "models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "not_create" BOOLEAN NOT NULL DEFAULT false,
    "not_edit" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_field_line" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "readonly" BOOLEAN NOT NULL DEFAULT false,
    "invisible" BOOLEAN NOT NULL DEFAULT false,
    "model_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "model_field_line_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "models_name_key" ON "models"("name");

-- CreateIndex
CREATE UNIQUE INDEX "models_display_name_key" ON "models"("display_name");

-- CreateIndex
CREATE INDEX "models_name_display_name_idx" ON "models"("name", "display_name");

-- CreateIndex
CREATE UNIQUE INDEX "model_field_line_name_key" ON "model_field_line"("name");

-- CreateIndex
CREATE UNIQUE INDEX "model_field_line_display_name_key" ON "model_field_line"("display_name");

-- CreateIndex
CREATE INDEX "model_field_line_name_display_name_idx" ON "model_field_line"("name", "display_name");

-- AddForeignKey
ALTER TABLE "model_field_line" ADD CONSTRAINT "model_field_line_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE SET NULL ON UPDATE CASCADE;
