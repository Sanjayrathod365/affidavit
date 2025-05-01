-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Provider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "fax" TEXT,
    "zipCode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "attentionInfo" TEXT,
    "hipaaRequired" BOOLEAN NOT NULL DEFAULT false,
    "hipaaSamplePath" TEXT,
    "brFaxNumber" TEXT,
    "mrFaxNumber" TEXT,
    "brEmailId" TEXT,
    "mrEmailId" TEXT,
    "mrPortalLink" TEXT,
    "mrPortalProviderId" TEXT,
    "brPortalLink" TEXT,
    "brPortalProviderId" TEXT,
    "brMailingAddress" TEXT,
    "mrMailingAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Provider" ("address", "createdAt", "email", "id", "name", "phone", "updatedAt") SELECT "address", "createdAt", "email", "id", "name", "phone", "updatedAt" FROM "Provider";
DROP TABLE "Provider";
ALTER TABLE "new_Provider" RENAME TO "Provider";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
