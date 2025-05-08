/*
  Warnings:

  - Added the required column `signature` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createTime` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "signature" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "createTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;
