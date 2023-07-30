/*
  Warnings:

  - You are about to drop the column `actingGroup` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "actingGroup";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "actingGroup" TEXT;
