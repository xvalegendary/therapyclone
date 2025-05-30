import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import * as schema from "./schema"

// Create a client with the database file path
const client = createClient({
  url: "file:aesterial.db",
})

// Create a Drizzle instance with the client and schema
export const db = drizzle(client, { schema })
