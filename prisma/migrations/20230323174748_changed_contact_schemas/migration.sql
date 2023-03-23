/*
  Warnings:

  - You are about to drop the column `email` on the `contact_messages` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `contact_messages` table. All the data in the column will be lost.
  - Made the column `contactId` on table `contact_messages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "contact_messages" DROP COLUMN "email",
DROP COLUMN "name",
ALTER COLUMN "contactId" SET NOT NULL;
