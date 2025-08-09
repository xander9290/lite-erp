/*
  Warnings:

  - Added the required column `displayName` to the `model_field_line` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "model_field_line" ADD COLUMN     "displayName" TEXT NOT NULL;
