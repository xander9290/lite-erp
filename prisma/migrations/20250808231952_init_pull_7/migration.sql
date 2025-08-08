/*
  Warnings:

  - You are about to drop the column `display_name` on the `group_line` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `group_line` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "group_line_display_name_key";

-- DropIndex
DROP INDEX "group_line_name_display_name_idx";

-- DropIndex
DROP INDEX "group_line_name_key";

-- AlterTable
ALTER TABLE "group_line" DROP COLUMN "display_name",
DROP COLUMN "name",
ADD COLUMN     "button_name" TEXT,
ADD COLUMN     "entity_name" TEXT,
ADD COLUMN     "field_name" TEXT,
ADD COLUMN     "invisible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "menu_name" TEXT,
ADD COLUMN     "noEdit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notCreate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "page_key" TEXT,
ADD COLUMN     "readonly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false;
