-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_areaId_fkey";

-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "deadline" DROP NOT NULL,
ALTER COLUMN "completed" SET DEFAULT false,
ALTER COLUMN "areaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "deadline" DROP NOT NULL,
ALTER COLUMN "completed" SET DEFAULT false,
ALTER COLUMN "projectId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;
