/*
  Warnings:

  - Added the required column `log_type` to the `ActivityLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `AdminUser` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('ERROR', 'ALERT', 'INFO', 'WARNING');

-- AlterTable
ALTER TABLE "ActivityLogs" ADD COLUMN     "log_type" "LogType" NOT NULL;

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "password" TEXT NOT NULL;
