/*
  Warnings:

  - Made the column `FKOwnerId` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_FKOwnerId_fkey";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "FKOwnerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_FKOwnerId_fkey" FOREIGN KEY ("FKOwnerId") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;
