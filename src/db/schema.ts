import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

// Define your database schema here
export const usersTable = sqliteTable("users", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  referralCode: text("referral_code").unique(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
})

export const productsTable = sqliteTable("products", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  price: int("price").notNull(), // Price in cents
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
})

export const ordersTable = sqliteTable("orders", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id),
  totalAmount: int("total_amount").notNull(), // Total amount in cents
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
})

export const orderItemsTable = sqliteTable("order_items", {
  id: int("id").primaryKey({ autoIncrement: true }),
  orderId: int("order_id")
    .notNull()
    .references(() => ordersTable.id),
  productId: int("product_id")
    .notNull()
    .references(() => productsTable.id),
  quantity: int("quantity").notNull(),
  price: int("price").notNull(), // Price at time of order in cents
})
