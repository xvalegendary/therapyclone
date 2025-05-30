CREATE TABLE order_items (
    id TEXT PRIMARY KEY NOT NULL,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL
);
--> statement-breakpoint
CREATE TABLE orders (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    total_amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    promo_code TEXT,
    discount REAL DEFAULT 0,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE products (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price_usd REAL NOT NULL,
    price_rub REAL NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE NOT NULL, -- Используем 1 для TRUE в BOOLEAN
    created_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE promo_codes (
    id TEXT PRIMARY KEY NOT NULL,
    code TEXT NOT NULL,
    discount REAL NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL, -- Используем 1 для TRUE в BOOLEAN
    expires_at TEXT,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0 NOT NULL,
    created_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX promo_codes_code_unique ON promo_codes (code);
--> statement-breakpoint
CREATE TABLE promo_usage (
    id TEXT PRIMARY KEY NOT NULL,
    promo_code_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    order_id TEXT NOT NULL,
    used_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE users (
    id TEXT PRIMARY KEY NOT NULL,
    username TEXT DEFAULT 'user' NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' NOT NULL,
    avatar TEXT,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL, -- Используем 0 для FALSE в BOOLEAN
    created_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX users_username_unique ON users (username);
--> statement-breakpoint
CREATE UNIQUE INDEX users_email_unique ON users (email);
--> statement-breakpoint
CREATE TABLE verification_codes (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
);