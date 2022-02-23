-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "someday" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "inbox" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "someday" BOOLEAN NOT NULL DEFAULT false;
