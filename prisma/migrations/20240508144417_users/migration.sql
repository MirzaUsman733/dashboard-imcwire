/*
  Warnings:

  - The primary key for the `pdf` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "pdf" DROP CONSTRAINT "pdf_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "pdf_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "pdf_id_seq";
