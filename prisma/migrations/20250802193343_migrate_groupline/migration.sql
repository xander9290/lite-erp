-- DropIndex
DROP INDEX "groups_name_idx";

-- CreateTable
CREATE TABLE "group_line" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "groupId" TEXT,
    "create_uid" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_line_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_line_name_key" ON "group_line"("name");

-- CreateIndex
CREATE UNIQUE INDEX "group_line_display_name_key" ON "group_line"("display_name");

-- CreateIndex
CREATE INDEX "group_line_name_display_name_idx" ON "group_line"("name", "display_name");

-- CreateIndex
CREATE INDEX "groups_name_display_name_idx" ON "groups"("name", "display_name");

-- AddForeignKey
ALTER TABLE "group_line" ADD CONSTRAINT "group_line_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
