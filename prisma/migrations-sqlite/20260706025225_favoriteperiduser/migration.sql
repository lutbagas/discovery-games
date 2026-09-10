/*
  Warnings:

  - The primary key for the `favorite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `userId` to the `favorite` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_favorite" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "released" TEXT NOT NULL,
    "background_image" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id", "userId"),
    CONSTRAINT "favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_favorite" ("background_image", "id", "name", "released") SELECT "background_image", "id", "name", "released" FROM "favorite";
DROP TABLE "favorite";
ALTER TABLE "new_favorite" RENAME TO "favorite";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
