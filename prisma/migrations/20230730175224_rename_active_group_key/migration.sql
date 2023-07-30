/*
  Warnings:

  - You are about to drop the column `actingGroup` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "actingGroup",
ADD COLUMN     "actingGroupId" TEXT;
