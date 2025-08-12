-- DropForeignKey
ALTER TABLE "model_field_line" DROP CONSTRAINT "model_field_line_model_id_fkey";

-- AddForeignKey
ALTER TABLE "model_field_line" ADD CONSTRAINT "model_field_line_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("name") ON DELETE CASCADE ON UPDATE CASCADE;
