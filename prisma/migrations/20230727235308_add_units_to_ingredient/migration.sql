/*
  Warnings:

  - Added the required column `unitId` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('NONE', 'OUNCE', 'POUND', 'TABLE_SPOON', 'TEA_SPOON', 'CUP', 'FLUID_OUNCE', 'PINT', 'QUART', 'GALLON');

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "unit" "Unit" NOT NULL DEFAULT 'NONE';
