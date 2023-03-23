/*
  Warnings:

  - The values [DRAFT] on the enum `ContactMessageStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `contact_id` on the `contact_messages` table. All the data in the column will be lost.
  - You are about to drop the column `draft_reply` on the `contact_messages` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContactMessageStatus_new" AS ENUM ('PENDING', 'VIEWED', 'CLOSED');
ALTER TABLE "contact_messages" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "contact_messages" ALTER COLUMN "status" TYPE "ContactMessageStatus_new" USING ("status"::text::"ContactMessageStatus_new");
ALTER TYPE "ContactMessageStatus" RENAME TO "ContactMessageStatus_old";
ALTER TYPE "ContactMessageStatus_new" RENAME TO "ContactMessageStatus";
DROP TYPE "ContactMessageStatus_old";
ALTER TABLE "contact_messages" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "contact_messages" DROP CONSTRAINT "contact_messages_contact_id_fkey";

-- AlterTable
ALTER TABLE "contact_messages" DROP COLUMN "contact_id",
DROP COLUMN "draft_reply",
ADD COLUMN     "contactId" INTEGER;

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "draftReply" TEXT;

-- AddForeignKey
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
