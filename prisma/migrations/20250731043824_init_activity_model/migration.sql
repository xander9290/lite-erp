/*
  Warnings:

  - You are about to drop the `groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `partners` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_create_uid_fkey";

-- DropForeignKey
ALTER TABLE "partners" DROP CONSTRAINT "partners_create_uid_fkey";

-- DropForeignKey
ALTER TABLE "partners" DROP CONSTRAINT "partners_image_id_fkey";

-- DropForeignKey
ALTER TABLE "partners" DROP CONSTRAINT "partners_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_group_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_partnerId_fkey";

-- DropTable
DROP TABLE "groups";

-- DropTable
DROP TABLE "images";

-- DropTable
DROP TABLE "partners";

-- DropTable
DROP TABLE "users";
