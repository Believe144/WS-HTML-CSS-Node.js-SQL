-- สร้างฐานข้อมูลใหม่
CREATE DATABASE my_database;

-- สร้างตาราง users
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- เพิ่มข้อมูล 5 แถวในตาราง users
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
INSERT INTO users (name, email) VALUES ('Charlie', 'charlie@example.com');
INSERT INTO users (name, email) VALUES ('David', 'david@example.com');
INSERT INTO users (name, email) VALUES ('Eve', 'eve@example.com');

-- ดึงข้อมูลทั้งหมดจากตาราง users
SELECT * FROM users;

-- อัปเดตข้อมูลของผู้ใช้ที่มี id เป็น 1
UPDATE users SET name = 'Alice Updated', email = 'alice.updated@example.com' WHERE id = 1;

-- ลบข้อมูลของผู้ใช้ที่มี id เป็น 3
DELETE FROM users WHERE id = 3;

-- ค้นหาผู้ใช้ที่มีอีเมลที่ลงท้ายด้วย @example.com
SELECT * FROM users WHERE email LIKE '%@example.com';
