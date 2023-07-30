/*
  Warnings:

  - You are about to drop the column `shoppingListId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `shoppingListId` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `shoppingListId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ShoppingList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_shoppingListId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_shoppingListId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_shoppingListId_fkey";

-- DropIndex
DROP INDEX "Group_shoppingListId_key";

-- DropIndex
DROP INDEX "User_shoppingListId_key";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "shoppingListId",
ADD COLUMN     "selectedRecipeIds" TEXT[];

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "shoppingListId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "shoppingListId",
ADD COLUMN     "selectedRecipeIds" TEXT[];

-- DropTable
DROP TABLE "ShoppingList";
