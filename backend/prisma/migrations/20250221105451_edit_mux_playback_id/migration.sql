/*
  Warnings:

  - You are about to drop the column `muxPlaybackUrl` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[muxPlaybackId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `muxPlaybackId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Video_muxPlaybackUrl_key";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "muxPlaybackUrl",
ADD COLUMN     "muxPlaybackId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Video_muxPlaybackId_key" ON "Video"("muxPlaybackId");
