-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "logged" BOOLEAN NOT NULL DEFAULT false;
