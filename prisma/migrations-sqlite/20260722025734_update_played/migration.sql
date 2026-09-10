-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Played" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "released" TEXT,
    "background_image" TEXT,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id", "userId"),
    CONSTRAINT "Played_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Played" ("background_image", "id", "name", "released", "userId") SELECT "background_image", "id", "name", "released", "userId" FROM "Played";
DROP TABLE "Played";
ALTER TABLE "new_Played" RENAME TO "Played";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
