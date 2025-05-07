/*
  Warnings:

  - Added the required column `coverId` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "avatarId" INTEGER;

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "coverId" INTEGER NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Statistic" (
    "contentId" TEXT NOT NULL,
    "comment" INTEGER NOT NULL,
    "like" INTEGER NOT NULL,
    "download" INTEGER NOT NULL,
    "play" INTEGER NOT NULL,
    "share" INTEGER NOT NULL,
    "forward" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Statistic_contentId_key" ON "Statistic"("contentId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statistic" ADD CONSTRAINT "Statistic_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
