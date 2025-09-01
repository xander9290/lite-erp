/*
  Warnings:

  - Made the column `create_uid` on table `partners` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "partners" DROP CONSTRAINT "partners_create_uid_fkey";

-- AlterTable
ALTER TABLE "partners" ALTER COLUMN "create_uid" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_create_uid_fkey" FOREIGN KEY ("create_uid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
