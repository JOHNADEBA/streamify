/*
  Warnings:

  - You are about to drop the column `aspect_ratio` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "aspect_ratio",
ADD COLUMN     "aspectRatio" TEXT;
