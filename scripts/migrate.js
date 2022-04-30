const Postgrator = require("postgrator");

const postgrator = new Postgrator({
  driver: "pg",
  connectionString: process.env.DATABASE_URL,
});

postgrator
  .migrate()
  .then((appliedMigrations) => console.log(appliedMigrations))
  .catch((error) => console.log(error));
