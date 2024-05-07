/*
  Warnings:

  - You are about to drop the column `image` on the `File` table. All the data in the column will be lost.
  - The primary key for the `LoginLog` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "LoginLog" DROP CONSTRAINT "LoginLog_pkey",
ADD CONSTRAINT "LoginLog_pkey" PRIMARY KEY ("id");
