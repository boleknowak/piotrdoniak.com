/*
  Warnings:

  - The `status` column on the `contact_messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ContactMessageStatus" AS ENUM ('PENDING', 'VIEWED', 'DRAFT', 'CLOSED');

-- AlterTable
ALTER TABLE "contact_messages" DROP COLUMN "status",
ADD COLUMN     "status" "ContactMessageStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "ContactStatus";
