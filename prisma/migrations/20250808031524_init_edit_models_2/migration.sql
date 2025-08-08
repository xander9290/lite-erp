/*
  Warnings:

  - Added the required column `type` to the `model_field_line` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "model_field_line" ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" TEXT NOT NULL;
