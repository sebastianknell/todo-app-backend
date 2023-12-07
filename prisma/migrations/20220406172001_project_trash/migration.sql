-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "logged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trash" BOOLEAN NOT NULL DEFAULT false;
