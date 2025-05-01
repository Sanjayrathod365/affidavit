/*
  Warnings:

  - Added the required column `userId` to the `AffidavitTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Affidavit" ADD COLUMN "generatedFilePath" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AffidavitTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "filePath" TEXT,
    "structure" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "logoPath" TEXT,
    "fontFamily" TEXT DEFAULT 'Arial',
    "fontSize" INTEGER DEFAULT 12,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "AffidavitTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AffidavitTemplate" ("createdAt", "description", "filePath", "fontFamily", "fontSize", "id", "isActive", "logoPath", "name", "structure", "updatedAt", "version") SELECT "createdAt", "description", "filePath", "fontFamily", "fontSize", "id", "isActive", "logoPath", "name", "structure", "updatedAt", "version" FROM "AffidavitTemplate";
DROP TABLE "AffidavitTemplate";
ALTER TABLE "new_AffidavitTemplate" RENAME TO "AffidavitTemplate";
CREATE TABLE "new_Provider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "brEmailId" TEXT,
    "mrEmailId" TEXT,
    "phone" TEXT,
    "fax" TEXT,
    "address" TEXT,
    "zipCode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "attentionInfo" TEXT,
    "hipaaRequired" BOOLEAN NOT NULL DEFAULT false,
    "hipaaSample" TEXT,
    "brFaxNumber" TEXT,
    "mrFaxNumber" TEXT,
    "brMailingAddress" TEXT,
    "mrMailingAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Provider" ("address", "brEmailId", "createdAt", "email", "hipaaSample", "id", "mrEmailId", "name", "phone", "updatedAt") SELECT "address", "brEmailId", "createdAt", "email", "hipaaSample", "id", "mrEmailId", "name", "phone", "updatedAt" FROM "Provider";
DROP TABLE "Provider";
ALTER TABLE "new_Provider" RENAME TO "Provider";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
