/*
  Warnings:

  - You are about to drop the column `shoppingListId` on the `Ingredient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_shoppingListId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "shoppingListId";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "shoppingListId" TEXT;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_shoppingListId_fkey" FOREIGN KEY ("shoppingListId") REFERENCES "ShoppingList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
