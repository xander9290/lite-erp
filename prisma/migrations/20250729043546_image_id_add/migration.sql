/*
  Warnings:

  - A unique constraint covering the columns `[image_id]` on the table `partners` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "image_id" TEXT;

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "entityType" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partners_image_id_key" ON "partners"("image_id");

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
