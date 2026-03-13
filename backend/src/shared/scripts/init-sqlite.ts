import Database from 'better-sqlite3';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the sqlite file
const dbPath = join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

console.log('Initializing SQLite database...');

const schema = `
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (class_id, name)
);

CREATE TABLE IF NOT EXISTS teachers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  date_of_birth TEXT NOT NULL,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
  section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE RESTRICT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  from_date TEXT NOT NULL,
  to_date TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_leave_date_range CHECK (to_date >= from_date)
);
`;

const seed = `
INSERT OR IGNORE INTO roles (name) VALUES ('ADMIN');
INSERT OR IGNORE INTO roles (name) VALUES ('TEACHER');
INSERT OR IGNORE INTO roles (name) VALUES ('STUDENT');

INSERT OR IGNORE INTO users (email, password_hash, first_name, last_name, role_id)
VALUES (
  'admin@school-admin.com',
  '$argon2id$v=19$m=65536,t=3,p=1$wXqFZ0J2C1l5Q0h2bFJnbA$y8XG4zS8o3xvQm6x2oQhZKq3V1Uj2y7h3t1k9dQmVxE',
  'System',
  'Admin',
  (SELECT id FROM roles WHERE name = 'ADMIN')
);

INSERT OR IGNORE INTO classes (name, description) VALUES ('Class 1', 'First grade');
INSERT OR IGNORE INTO classes (name, description) VALUES ('Class 2', 'Second grade');

INSERT OR IGNORE INTO sections (name, class_id)
SELECT 'A', id FROM classes WHERE name = 'Class 1';

INSERT OR IGNORE INTO sections (name, class_id)
SELECT 'B', id FROM classes WHERE name = 'Class 1';

INSERT OR IGNORE INTO teachers (first_name, last_name, email, phone)
VALUES ('Ali', 'Khan', 'ali.khan@school.com', '03001234567');

INSERT OR IGNORE INTO students (first_name, last_name, email, phone, date_of_birth, class_id, section_id)
SELECT 'Ayesha', 'Malik', 'ayesha.malik@student.com', '03007654321', '2010-05-12', 
  (SELECT id FROM classes WHERE name='Class 1'), 
  (SELECT id FROM sections WHERE name='A' AND class_id=(SELECT id FROM classes WHERE name='Class 1'));

INSERT OR IGNORE INTO notices (title, content, created_by)
SELECT 'Welcome', 'Welcome to the Student Management System!', (SELECT id FROM users WHERE email='admin@school-admin.com');
`;

db.exec(schema);
db.exec(seed);

console.log('Database initialized successfully with seed data.');
process.exit(0);
