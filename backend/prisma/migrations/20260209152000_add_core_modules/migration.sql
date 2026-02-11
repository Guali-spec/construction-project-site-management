-- Enums (PostgreSQL enum creation with guard)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ExpenseStatus') THEN
    CREATE TYPE "ExpenseStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ReportType') THEN
    CREATE TYPE "ReportType" AS ENUM ('PROJECT_SUMMARY', 'FINANCIAL', 'ATTENDANCE', 'PROGRESS');
  END IF;
END $$;

-- Attendance
CREATE TABLE "attendances" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "workerId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "present" BOOLEAN NOT NULL DEFAULT true,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- Materials
CREATE TABLE "materials" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "unit" TEXT,
  "quantity" INTEGER NOT NULL DEFAULT 0,
  "unitCost" DECIMAL(12,2),
  "totalCost" DECIMAL(14,2),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- Expenses
CREATE TABLE "expenses" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "amount" DECIMAL(14,2) NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT,
  "status" "ExpenseStatus" NOT NULL DEFAULT 'PENDING',
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- Progress photos
CREATE TABLE "progress_photos" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "taskId" TEXT,
  "url" TEXT NOT NULL,
  "caption" TEXT,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "progress_photos_pkey" PRIMARY KEY ("id")
);

-- Reports
CREATE TABLE "reports" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "type" "ReportType" NOT NULL,
  "payload" JSONB,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- FKs
ALTER TABLE "attendances"
ADD CONSTRAINT "attendances_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "attendances"
ADD CONSTRAINT "attendances_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "materials"
ADD CONSTRAINT "materials_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "expenses"
ADD CONSTRAINT "expenses_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "expenses"
ADD CONSTRAINT "expenses_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "progress_photos"
ADD CONSTRAINT "progress_photos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "progress_photos"
ADD CONSTRAINT "progress_photos_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "progress_photos"
ADD CONSTRAINT "progress_photos_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "reports"
ADD CONSTRAINT "reports_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reports"
ADD CONSTRAINT "reports_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Indexes
CREATE INDEX "attendances_projectId_idx" ON "attendances"("projectId");
CREATE INDEX "attendances_workerId_idx" ON "attendances"("workerId");
CREATE INDEX "attendances_date_idx" ON "attendances"("date");
CREATE INDEX "attendances_deletedAt_idx" ON "attendances"("deletedAt");

CREATE INDEX "materials_projectId_idx" ON "materials"("projectId");
CREATE INDEX "materials_deletedAt_idx" ON "materials"("deletedAt");

CREATE INDEX "expenses_projectId_idx" ON "expenses"("projectId");
CREATE INDEX "expenses_createdById_idx" ON "expenses"("createdById");
CREATE INDEX "expenses_status_idx" ON "expenses"("status");
CREATE INDEX "expenses_deletedAt_idx" ON "expenses"("deletedAt");

CREATE INDEX "progress_photos_projectId_idx" ON "progress_photos"("projectId");
CREATE INDEX "progress_photos_taskId_idx" ON "progress_photos"("taskId");
CREATE INDEX "progress_photos_createdById_idx" ON "progress_photos"("createdById");
CREATE INDEX "progress_photos_deletedAt_idx" ON "progress_photos"("deletedAt");

CREATE INDEX "reports_projectId_idx" ON "reports"("projectId");
CREATE INDEX "reports_type_idx" ON "reports"("type");
CREATE INDEX "reports_createdById_idx" ON "reports"("createdById");
CREATE INDEX "reports_deletedAt_idx" ON "reports"("deletedAt");
