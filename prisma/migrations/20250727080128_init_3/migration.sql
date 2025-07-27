/*
  Warnings:

  - You are about to drop the `Partner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_partner_id_fkey";

-- DropTable
DROP TABLE "Partner";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "street" TEXT,
    "second_street" TEXT,
    "town" TEXT,
    "city" TEXT,
    "province" TEXT,
    "country" TEXT,
    "zip" INTEGER,
    "vat" TEXT,
    "state" TEXT,
    "imageUrl" TEXT,
    "display_type" TEXT NOT NULL DEFAULT 'internal',
    "user_id" TEXT,
    "create_uid" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "group_id" TEXT,
    "partnerId" TEXT,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "create_uid" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partners_display_name_key" ON "partners"("display_name");

-- CreateIndex
CREATE INDEX "partners_name_display_name_phone_idx" ON "partners"("name", "display_name", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "users_display_name_key" ON "users"("display_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_group_id_key" ON "users"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_partnerId_key" ON "users"("partnerId");

-- CreateIndex
CREATE INDEX "users_display_name_idx" ON "users"("display_name");

-- CreateIndex
CREATE UNIQUE INDEX "groups_name_key" ON "groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "groups_display_name_key" ON "groups"("display_name");

-- CreateIndex
CREATE INDEX "groups_name_idx" ON "groups"("name");

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_create_uid_fkey" FOREIGN KEY ("create_uid") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_create_uid_fkey" FOREIGN KEY ("create_uid") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
