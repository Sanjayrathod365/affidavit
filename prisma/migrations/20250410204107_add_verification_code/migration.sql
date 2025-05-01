/*
  Warnings:

  - You are about to drop the column `endDate` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `attentionInfo` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `brFaxNumber` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `brMailingAddress` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `brPortalLink` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `brPortalProviderId` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `fax` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `hipaaRequired` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `hipaaSamplePath` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `mrFaxNumber` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `mrMailingAddress` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `mrPortalLink` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `mrPortalProviderId` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Provider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Affidavit" ADD COLUMN "verificationCode" TEXT;

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientName" TEXT NOT NULL,
    "dateOfBirth" DATETIME,
    "dateOfInjury" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Patient" ("createdAt", "dateOfBirth", "dateOfInjury", "id", "patientName", "updatedAt") SELECT "createdAt", "dateOfBirth", "dateOfInjury", "id", "patientName", "updatedAt" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE TABLE "new_Provider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "brEmailId" TEXT,
    "mrEmailId" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "hipaaSample" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Provider" ("address", "brEmailId", "createdAt", "email", "id", "mrEmailId", "name", "phone", "updatedAt") SELECT "address", "brEmailId", "createdAt", "email", "id", "mrEmailId", "name", "phone", "updatedAt" FROM "Provider";
DROP TABLE "Provider";
ALTER TABLE "new_Provider" RENAME TO "Provider";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "role" TEXT DEFAULT 'STAFF',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
