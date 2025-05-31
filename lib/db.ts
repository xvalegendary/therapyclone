import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import * as schema from "./db/schema"


const client = createClient({
  url: "file:sqlite.db",
})


export const db = drizzle(client, { schema })
