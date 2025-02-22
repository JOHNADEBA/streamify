/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[muxAssetId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `muxAssetId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "muxAssetId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Video_muxAssetId_key" ON "Video"("muxAssetId");
