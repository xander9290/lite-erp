/*
  Warnings:

  - You are about to drop the column `button_name` on the `group_line` table. All the data in the column will be lost.
  - You are about to drop the column `menu_name` on the `group_line` table. All the data in the column will be lost.
  - You are about to drop the column `page_key` on the `group_line` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "group_line" DROP COLUMN "button_name",
DROP COLUMN "menu_name",
DROP COLUMN "page_key";
