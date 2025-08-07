/*
  Warnings:

  - Added the required column `label` to the `models` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "models" ADD COLUMN     "label" TEXT NOT NULL;
