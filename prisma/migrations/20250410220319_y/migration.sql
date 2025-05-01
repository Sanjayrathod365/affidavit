-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Affidavit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "verificationCode" TEXT,
    "templateId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Affidavit_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "AffidavitTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Affidavit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Affidavit_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Affidavit" ("content", "createdAt", "id", "patientId", "providerId", "status", "updatedAt", "verificationCode") SELECT "content", "createdAt", "id", "patientId", "providerId", "status", "updatedAt", "verificationCode" FROM "Affidavit";
DROP TABLE "Affidavit";
ALTER TABLE "new_Affidavit" RENAME TO "Affidavit";
CREATE TABLE "new_AffidavitTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "filePath" TEXT NOT NULL,
    "structure" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "logoPath" TEXT,
    "fontFamily" TEXT DEFAULT 'Arial',
    "fontSize" INTEGER DEFAULT 12,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AffidavitTemplate" ("createdAt", "filePath", "id", "name", "structure", "updatedAt", "version") SELECT "createdAt", "filePath", "id", "name", "structure", "updatedAt", "version" FROM "AffidavitTemplate";
DROP TABLE "AffidavitTemplate";
ALTER TABLE "new_AffidavitTemplate" RENAME TO "AffidavitTemplate";
CREATE UNIQUE INDEX "AffidavitTemplate_name_key" ON "AffidavitTemplate"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
