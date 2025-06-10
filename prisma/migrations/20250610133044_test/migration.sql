-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_FKOwnerId_fkey";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "FKOwnerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_FKOwnerId_fkey" FOREIGN KEY ("FKOwnerId") REFERENCES "User"("UserID") ON DELETE SET NULL ON UPDATE CASCADE;
