import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

// تهيئة قاعدة البيانات وإنشاء الجداول
// Initialize database and create tables
export const initDatabase = () => {
  const db = new Database(path.join(__dirname, '../../database.db'));

  // إعداد الجداول
  // Setup tables
  db.exec(`
    -- جدول المستخدمين
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'cashier')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- جدول المنتجات
    -- Products table
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      cost REAL NOT NULL,
      quantity INTEGER DEFAULT 0,
      category TEXT,
      image_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- جدول العملاء
    -- Customers table
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- جدول المبيعات
    -- Sales table
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      user_id INTEGER NOT NULL,
      total REAL NOT NULL,
      discount REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      payment_method TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- جدول تفاصيل المبيعات
    -- Sale details table
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sale_id) REFERENCES sales(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    -- جدول المصروفات
    -- Expenses table
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- جدول الإعدادات
    -- Settings table
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // إدخال بيانات افتراضية
  // Insert default data
  const hashedPassword = bcrypt.hashSync('password', 10);
  
  // إدخال المستخدم الافتراضي (admin)
  // Insert default admin user
  const insertAdmin = db.prepare(`
    INSERT OR IGNORE INTO users (username, password, role)
    VALUES (?, ?, ?)
  `);
  insertAdmin.run('admin', hashedPassword, 'admin');

  // إدخال إعدادات افتراضية
  // Insert default settings
  const insertSetting = db.prepare(`
    INSERT OR IGNORE INTO settings (key, value)
    VALUES (?, ?)
  `);
  
  const defaultSettings = [
    ['language', 'ar'],
    ['currency', 'SAR'],
    ['tax_rate', '15'],
    ['company_name', 'POS System'],
    ['receipt_footer', 'شكراً لزيارتكم - Thank you for your visit'],
    ['theme', 'light']
  ];

  defaultSettings.forEach(([key, value]) => {
    insertSetting.run(key, value);
  });

  // إدخال منتجات تجريبية
  // Insert sample products
  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (code, name, description, price, cost, quantity, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleProducts = [
    ['P001', 'لابتوب HP', 'HP Laptop 15.6"', 2999.99, 2500, 10, 'إلكترونيات'],
    ['P002', 'ماوس لوجيتك', 'Logitech Mouse', 99.99, 70, 20, 'إكسسوارات'],
    ['P003', 'كيبورد ميكانيكي', 'Mechanical Keyboard', 299.99, 200, 15, 'إكسسوارات']
  ];

  sampleProducts.forEach(([code, name, desc, price, cost, qty, cat]) => {
    insertProduct.run(code, name, desc, price, cost, qty, cat);
  });

  return db;
};

// تصدير دالة مساعدة للحصول على اتصال قاعدة البيانات
// Export helper function to get database connection
export const getDatabase = () => {
  return new Database(path.join(__dirname, '../../database.db'));
};