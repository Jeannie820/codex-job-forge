PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS "Application";
DROP TABLE IF EXISTS "Interview";
DROP TABLE IF EXISTS "Asset";
DROP TABLE IF EXISTS "Job";

CREATE TABLE "Job" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "title" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "salary" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'saved',
  "match" INTEGER NOT NULL DEFAULT 70,
  "requirementsJson" TEXT NOT NULL DEFAULT '[]',
  "description" TEXT NOT NULL DEFAULT '',
  "note" TEXT NOT NULL DEFAULT '',
  "appliedAt" TEXT NOT NULL DEFAULT '',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Application" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "jobId" INTEGER,
  "company" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "resume" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "response" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'submitted',
  "description" TEXT NOT NULL DEFAULT '',
  "alert" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Interview" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "jobId" INTEGER,
  "interviewAt" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "round" INTEGER NOT NULL DEFAULT 1,
  "title" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "score" INTEGER,
  "companyResearch" TEXT,
  "roleMatch" TEXT,
  "questions" TEXT,
  "projectStories" TEXT,
  "preparedQuestionsJson" TEXT NOT NULL DEFAULT '[]',
  "preparedProjectStoriesJson" TEXT NOT NULL DEFAULT '[]',
  "usedAssetIdsJson" TEXT NOT NULL DEFAULT '[]',
  "strengths" TEXT,
  "improvements" TEXT,
  "followUp" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Interview_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Asset" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "tagsJson" TEXT NOT NULL DEFAULT '[]',
  "usage" INTEGER NOT NULL DEFAULT 0,
  "updatedAtText" TEXT NOT NULL,
  "createdAtText" TEXT NOT NULL,
  "content" TEXT NOT NULL DEFAULT '',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
