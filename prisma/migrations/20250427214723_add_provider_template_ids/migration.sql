-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "usesFax" BOOLEAN NOT NULL DEFAULT false,
    "usesEmail" BOOLEAN NOT NULL DEFAULT false,
    "usesMail" BOOLEAN NOT NULL DEFAULT false,
    "usesSmartPortal" BOOLEAN NOT NULL DEFAULT false,
    "brSubmissionMethod" TEXT NOT NULL DEFAULT 'NONE',
    "mrSubmissionMethod" TEXT NOT NULL DEFAULT 'NONE',
    "brFaxNumber" TEXT,
    "mrFaxNumber" TEXT,
    "brMailingAddress" TEXT,
    "mrMailingAddress" TEXT,
    "brSmartPortal" TEXT,
    "mrSmartPortal" TEXT,
    "smartFolder" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "brAffidavitTemplateId" TEXT,
    "mrAffidavitTemplateId" TEXT,
    CONSTRAINT "Provider_brAffidavitTemplateId_fkey" FOREIGN KEY ("brAffidavitTemplateId") REFERENCES "AffidavitTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Provider_mrAffidavitTemplateId_fkey" FOREIGN KEY ("mrAffidavitTemplateId") REFERENCES "AffidavitTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Provider" ("address", "attentionInfo", "brEmailId", "brFaxNumber", "brMailingAddress", "brSmartPortal", "brSubmissionMethod", "city", "createdAt", "email", "fax", "hipaaRequired", "hipaaSample", "id", "mrEmailId", "mrFaxNumber", "mrMailingAddress", "mrSmartPortal", "mrSubmissionMethod", "name", "phone", "smartFolder", "state", "updatedAt", "usesEmail", "usesFax", "usesMail", "usesSmartPortal", "zipCode") SELECT "address", "attentionInfo", "brEmailId", "brFaxNumber", "brMailingAddress", "brSmartPortal", "brSubmissionMethod", "city", "createdAt", "email", "fax", "hipaaRequired", "hipaaSample", "id", "mrEmailId", "mrFaxNumber", "mrMailingAddress", "mrSmartPortal", "mrSubmissionMethod", "name", "phone", "smartFolder", "state", "updatedAt", "usesEmail", "usesFax", "usesMail", "usesSmartPortal", "zipCode" FROM "Provider";
DROP TABLE "Provider";
ALTER TABLE "new_Provider" RENAME TO "Provider";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
