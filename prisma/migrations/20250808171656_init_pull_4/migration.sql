/*
  Warnings:

  - Added the required column `label` to the `model_field_line` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "model_field_line" ADD COLUMN     "label" TEXT NOT NULL;
