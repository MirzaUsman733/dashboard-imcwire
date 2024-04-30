/*
  Warnings:

  - The primary key for the `LoginLog` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "LoginLog" DROP CONSTRAINT "LoginLog_pkey",
ADD CONSTRAINT "LoginLog_pkey" PRIMARY KEY ("userId");
