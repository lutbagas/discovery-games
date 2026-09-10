-- CreateTable
CREATE TABLE "played" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "released" TEXT NOT NULL,
    "background_image" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id", "userId"),
    CONSTRAINT "played_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
