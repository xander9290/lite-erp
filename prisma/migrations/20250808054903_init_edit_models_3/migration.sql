/*
  Warnings:

  - You are about to drop the column `display_name` on the `model_field_line` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "model_field_line_display_name_key";

-- DropIndex
DROP INDEX "model_field_line_name_display_name_idx";

-- AlterTable
ALTER TABLE "model_field_line" DROP COLUMN "display_name";
