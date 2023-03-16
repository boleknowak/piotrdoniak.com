/*
  Warnings:

  - You are about to drop the column `message` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `contacts` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ContactStatus" ADD VALUE 'DRAFT';

-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "message",
DROP COLUMN "status",
ADD COLUMN     "avatar" TEXT;

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "draft_reply" TEXT,
    "status" "ContactStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contact_id" INTEGER,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
