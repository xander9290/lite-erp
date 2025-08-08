/*
  Warnings:

  - You are about to drop the column `invisible` on the `model_field_line` table. All the data in the column will be lost.
  - You are about to drop the column `readonly` on the `model_field_line` table. All the data in the column will be lost.
  - You are about to drop the column `not_create` on the `models` table. All the data in the column will be lost.
  - You are about to drop the column `not_edit` on the `models` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "model_field_line" DROP COLUMN "invisible",
DROP COLUMN "readonly";

-- AlterTable
ALTER TABLE "models" DROP COLUMN "not_create",
DROP COLUMN "not_edit";
