/*
  Warnings:

  - You are about to drop the column `agencyName` on the `compaignData` table. All the data in the column will be lost.
  - You are about to drop the column `isAgency` on the `compaignData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAgency" BOOLEAN;

-- AlterTable
ALTER TABLE "compaignData" DROP COLUMN "agencyName",
DROP COLUMN "isAgency";
