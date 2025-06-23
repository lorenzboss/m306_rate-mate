-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_FKAspectId_fkey";

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_FKAspectId_fkey" FOREIGN KEY ("FKAspectId") REFERENCES "Aspect"("AspectID") ON DELETE CASCADE ON UPDATE CASCADE;
