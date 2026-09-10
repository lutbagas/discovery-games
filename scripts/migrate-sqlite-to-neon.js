const { execFileSync } = require("child_process");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const sqliteDb = "sandbox/sqlite-backup/dev.db";

function querySQLite(sql) {
  const result = execFileSync(
    "sqlite3",
    ["-json", sqliteDb, sql],
    { encoding: "utf8" }
  );

  return JSON.parse(result || "[]");
}

async function main() {
  const users = querySQLite("SELECT * FROM User;");
  const favorites = querySQLite("SELECT * FROM favorite;");
  const played = querySQLite("SELECT * FROM Played;");

  console.log("===== SQLite Data =====");
  console.log("User:", users.length);
  console.log("favorite:", favorites.length);
  console.log("Played:", played.length);

  console.log("\n===== Neon Connection =====");

  await prisma.$connect();

  const userCount = await prisma.user.count();
  const favoriteCount = await prisma.favorite.count();
  const playedCount = await prisma.played.count();

  console.log("Neon User:", userCount);
  console.log("Neon favorite:", favoriteCount);
  console.log("Neon Played:", playedCount);
  console.log("\n===== Migrating Users =====");

const neonUsers = await prisma.user.findMany({
  select: {
    id: true,
  },
});

const sqliteUserIds = users.map((user) => user.id).sort();
const neonUserIds = neonUsers.map((user) => user.id).sort();

const sameUsers =
  sqliteUserIds.length === neonUserIds.length &&
  sqliteUserIds.every((id, index) => id === neonUserIds[index]);

if (neonUsers.length === 0) {
  for (const user of users) {
    await prisma.user.create({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        createdAt: new Date(user.createdAt),
      },
    });
  }

  console.log(`Migrated ${users.length} users`);
} else if (sameUsers) {
  console.log("Users already migrated. Skipping User migration.");
} else {
  throw new Error(
    "Neon User data does not match SQLite source. Migration stopped."
  );
}
console.log("\n===== Migrating Favorites =====");

const neonFavorites = await prisma.favorite.findMany({
  select: {
    id: true,
    userId: true,
  },
});

const sqliteFavoriteIds = favorites
  .map((favorite) => `${favorite.id}-${favorite.userId}`)
  .sort();

const neonFavoriteIds = neonFavorites
  .map((favorite) => `${favorite.id}-${favorite.userId}`)
  .sort();

const sameFavorites =
  sqliteFavoriteIds.length === neonFavoriteIds.length &&
  sqliteFavoriteIds.every(
    (id, index) => id === neonFavoriteIds[index]
  );

if (neonFavorites.length === 0) {
  await prisma.favorite.createMany({
    data: favorites.map((favorite) => ({
      id: favorite.id,
      name: favorite.name,
      released: favorite.released,
      background_image: favorite.background_image,
      userId: favorite.userId,
    })),
  });

  console.log(`Migrated ${favorites.length} favorites`);
} else if (sameFavorites) {
  console.log("Favorites already migrated. Skipping favorite migration.");
} else {
  throw new Error(
    "Neon favorite data does not match SQLite source. Migration stopped."
  );
}
console.log("\n===== Migrating Played =====");

const neonPlayed = await prisma.played.findMany({
  select: {
    id: true,
    userId: true,
  },
});

const sqlitePlayedIds = played
  .map((item) => `${item.id}-${item.userId}`)
  .sort();

const neonPlayedIds = neonPlayed
  .map((item) => `${item.id}-${item.userId}`)
  .sort();

const samePlayed =
  sqlitePlayedIds.length === neonPlayedIds.length &&
  sqlitePlayedIds.every(
    (id, index) => id === neonPlayedIds[index]
  );

if (neonPlayed.length === 0) {
  await prisma.played.createMany({
    data: played.map((item) => ({
      id: item.id,
      name: item.name,
      released: item.released,
      background_image: item.background_image,
      userId: item.userId,
    })),
  });

  console.log(`Migrated ${played.length} played records`);
} else if (samePlayed) {
  console.log("Played already migrated. Skipping Played migration.");
} else {
  throw new Error(
    "Neon Played data does not match SQLite source. Migration stopped."
  );
}
const migratedUserCount = await prisma.user.count();
const migratedFavoriteCount = await prisma.favorite.count();
const migratedPlayedCount = await prisma.played.count();

console.log("\n===== Final Counts =====");
console.log("Neon User:", migratedUserCount);
console.log("Neon favorite:", migratedFavoriteCount);
console.log("Neon Played:", migratedPlayedCount);

console.log("\n===== Verifying Data =====");

const neonUserIdsForVerification = (
  await prisma.user.findMany({
    select: {
      id: true,
    },
  })
)
  .map((user) => user.id)
  .sort();

const sqliteUserIdsForVerification = users
  .map((user) => user.id)
  .sort();

const usersMatch =
  sqliteUserIdsForVerification.length ===
    neonUserIdsForVerification.length &&
  sqliteUserIdsForVerification.every(
    (id, index) => id === neonUserIdsForVerification[index]
  );

console.log("User data match:", usersMatch);
const neonFavoriteIdsForVerification = (
  await prisma.favorite.findMany({
    select: {
      id: true,
      userId: true,
    },
  })
)
  .map((favorite) => `${favorite.id}-${favorite.userId}`)
  .sort();

const sqliteFavoriteIdsForVerification = favorites
  .map((favorite) => `${favorite.id}-${favorite.userId}`)
  .sort();

const favoritesMatch =
  sqliteFavoriteIdsForVerification.length ===
    neonFavoriteIdsForVerification.length &&
  sqliteFavoriteIdsForVerification.every(
    (id, index) => id === neonFavoriteIdsForVerification[index]
  );

console.log("Favorite data match:", favoritesMatch);

const neonPlayedIdsForVerification = (
  await prisma.played.findMany({
    select: {
      id: true,
      userId: true,
    },
  })
)
  .map((item) => `${item.id}-${item.userId}`)
  .sort();

const sqlitePlayedIdsForVerification = played
  .map((item) => `${item.id}-${item.userId}`)
  .sort();

const playedMatch =
  sqlitePlayedIdsForVerification.length ===
    neonPlayedIdsForVerification.length &&
  sqlitePlayedIdsForVerification.every(
    (id, index) => id === neonPlayedIdsForVerification[index]
  );

console.log("Played data match:", playedMatch);
}

main()
  .catch((error) => {
    console.error("Migration failed:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });