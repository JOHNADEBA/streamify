-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'PREMIUM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
