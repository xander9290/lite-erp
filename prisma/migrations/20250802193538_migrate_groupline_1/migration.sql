/*
  Warnings:

  - You are about to drop the column `groupId` on the `group_line` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "group_line" DROP CONSTRAINT "group_line_groupId_fkey";

-- AlterTable
ALTER TABLE "group_line" DROP COLUMN "groupId",
ADD COLUMN     "group_id" TEXT;

-- AddForeignKey
ALTER TABLE "group_line" ADD CONSTRAINT "group_line_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
