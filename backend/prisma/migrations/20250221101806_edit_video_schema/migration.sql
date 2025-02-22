/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[muxPlaybackUrl]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `muxPlaybackUrl` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "videoUrl",
ADD COLUMN     "aspect_ratio" TEXT,
ADD COLUMN     "muxPlaybackUrl" TEXT NOT NULL,
ALTER COLUMN "duration" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Video_muxPlaybackUrl_key" ON "Video"("muxPlaybackUrl");
