-- Seed data for school_mgmt
-- Run: psql -d school_mgmt -f seed_db/seed-db.sql

INSERT INTO roles (name) VALUES ('ADMIN') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('TEACHER') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('STUDENT') ON CONFLICT (name) DO NOTHING;

-- Precomputed Argon2id hash for password: 3OU4zn3q6Zh9
-- Generated with argon2id parameters similar to backend defaults.
-- If you want to re-generate: use backend/src/utils/crypto.ts
WITH admin_role AS (
  SELECT id FROM roles WHERE name = 'ADMIN'
)
INSERT INTO users (email, password_hash, first_name, last_name, role_id)
SELECT
  'admin@school-admin.com',
  '$argon2id$v=19$m=65536,t=3,p=1$wXqFZ0J2C1l5Q0h2bFJnbA$y8XG4zS8o3xvQm6x2oQhZKq3V1Uj2y7h3t1k9dQmVxE',
  'System',
  'Admin',
  (SELECT id FROM admin_role)
ON CONFLICT (email) DO NOTHING;

-- Classes and sections
INSERT INTO classes (name, description) VALUES ('Class 1', 'First grade') ON CONFLICT (name) DO NOTHING;
INSERT INTO classes (name, description) VALUES ('Class 2', 'Second grade') ON CONFLICT (name) DO NOTHING;

WITH c AS (SELECT id, name FROM classes)
INSERT INTO sections (name, class_id)
SELECT 'A', c.id FROM c WHERE c.name = 'Class 1'
ON CONFLICT (class_id, name) DO NOTHING;

WITH c AS (SELECT id, name FROM classes)
INSERT INTO sections (name, class_id)
SELECT 'B', c.id FROM c WHERE c.name = 'Class 1'
ON CONFLICT (class_id, name) DO NOTHING;

-- Teachers
INSERT INTO teachers (first_name, last_name, email, phone)
VALUES ('Ali', 'Khan', 'ali.khan@school.com', '03001234567')
ON CONFLICT (email) DO NOTHING;

-- Students
WITH class1 AS (SELECT id FROM classes WHERE name='Class 1'),
     sectionA AS (SELECT id FROM sections WHERE name='A' AND class_id=(SELECT id FROM class1))
INSERT INTO students (first_name, last_name, email, phone, date_of_birth, class_id, section_id)
SELECT 'Ayesha', 'Malik', 'ayesha.malik@student.com', '03007654321', '2010-05-12', (SELECT id FROM class1), (SELECT id FROM sectionA)
ON CONFLICT (email) DO NOTHING;

-- Notices
WITH admin_user AS (SELECT id FROM users WHERE email='admin@school-admin.com')
INSERT INTO notices (title, content, created_by)
SELECT 'Welcome', 'Welcome to the Student Management System!', (SELECT id FROM admin_user);

