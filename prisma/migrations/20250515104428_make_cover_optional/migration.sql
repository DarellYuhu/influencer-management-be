-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_coverId_fkey";

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "coverId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
