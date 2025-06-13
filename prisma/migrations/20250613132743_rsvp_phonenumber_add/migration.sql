/*
  Warnings:

  - You are about to drop the column `phone` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "rsvps" ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '';
