/*
  Warnings:

  - You are about to drop the `played` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "played";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Played" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "released" TEXT NOT NULL,
    "background_image" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id", "userId"),
    CONSTRAINT "Played_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
