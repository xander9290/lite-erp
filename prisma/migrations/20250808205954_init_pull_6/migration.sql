-- DropForeignKey
ALTER TABLE "group_line" DROP CONSTRAINT "group_line_group_id_fkey";

-- DropForeignKey
ALTER TABLE "model_field_line" DROP CONSTRAINT "model_field_line_model_id_fkey";

-- AddForeignKey
ALTER TABLE "group_line" ADD CONSTRAINT "group_line_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_field_line" ADD CONSTRAINT "model_field_line_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE CASCADE ON UPDATE CASCADE;
