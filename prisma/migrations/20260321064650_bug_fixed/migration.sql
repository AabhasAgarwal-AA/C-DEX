/*
  Warnings:

  - You are about to drop the column `balace` on the `InrWallet` table. All the data in the column will be lost.
  - Added the required column `balance` to the `InrWallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InrWallet" DROP COLUMN "balace",
ADD COLUMN     "balance" INTEGER NOT NULL;
