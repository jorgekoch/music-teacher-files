/*
  Warnings:

  - You are about to drop the column `publicId` on the `File` table. All the data in the column will be lost.
  - Added the required column `storageKey` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "publicId",
ADD COLUMN     "storageKey" TEXT NOT NULL,
ALTER COLUMN "url" DROP NOT NULL;
