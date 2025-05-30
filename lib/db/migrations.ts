import { migrate } from "drizzle-orm/libsql/migrator"
import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"

async function runMigrations() {
  const client = createClient({
    url: "file:hoodie-store.db",
  })

  const db = drizzle(client)

  console.log("Running migrations...")

  await migrate(db, { migrationsFolder: "drizzle" })

  console.log("Migrations complete!")

  process.exit(0)
}

runMigrations().catch((err) => {
  console.error("Error running migrations:", err)
  process.exit(1)
})
