/*
  Warnings:

  - You are about to drop the column `gymId` on the `check_ins` table. All the data in the column will be lost.
  - You are about to drop the column `pasword_hash` on the `users` table. All the data in the column will be lost.
  - Added the required column `gym_id` to the `check_ins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "check_ins" DROP CONSTRAINT "check_ins_gymId_fkey";

-- AlterTable
ALTER TABLE "check_ins" DROP COLUMN "gymId",
ADD COLUMN     "gym_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "pasword_hash",
ADD COLUMN     "password_hash" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
