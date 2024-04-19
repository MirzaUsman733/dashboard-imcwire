/*
  Warnings:

  - The primary key for the `PlanItem` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "PlanItem" DROP CONSTRAINT "PlanItem_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PlanItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PlanItem_id_seq";
