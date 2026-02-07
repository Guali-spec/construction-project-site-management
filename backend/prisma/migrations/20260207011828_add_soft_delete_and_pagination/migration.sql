/*
  Warnings:

  - A unique constraint covering the columns `[projectId,userId,deletedAt]` on the table `project_members` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "project_members_projectId_userId_key";

-- AlterTable
ALTER TABLE "activity_logs" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "lots" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "phases" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "project_members" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "workers" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "activity_logs_deletedAt_idx" ON "activity_logs"("deletedAt");

-- CreateIndex
CREATE INDEX "lots_deletedAt_idx" ON "lots"("deletedAt");

-- CreateIndex
CREATE INDEX "phases_deletedAt_idx" ON "phases"("deletedAt");

-- CreateIndex
CREATE INDEX "project_members_deletedAt_idx" ON "project_members"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "project_members_projectId_userId_deletedAt_key" ON "project_members"("projectId", "userId", "deletedAt");

-- CreateIndex
CREATE INDEX "projects_deletedAt_idx" ON "projects"("deletedAt");

-- CreateIndex
CREATE INDEX "refresh_tokens_deletedAt_idx" ON "refresh_tokens"("deletedAt");

-- CreateIndex
CREATE INDEX "tasks_deletedAt_idx" ON "tasks"("deletedAt");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- CreateIndex
CREATE INDEX "workers_deletedAt_idx" ON "workers"("deletedAt");
