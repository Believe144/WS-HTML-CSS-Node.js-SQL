const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const path = require('path');
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // เปิดใช้งานโฟลเดอร์ public สำหรับไฟล์ static เช่น HTML, CSS, JS

// สร้างฐานข้อมูลและเชื่อมต่อ
const db = new sqlite3.Database('/database/my_db.sql'); // ใช้ชื่อไฟล์เพื่อเก็บข้อมูล

// สร้างตารางฐานข้อมูล
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT,
      completed BOOLEAN
  )`);
});

// เปิดใช้งานเส้นทางสำหรับหน้าแรก
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ดึงรายการงานทั้งหมด
app.get('/todos', (req, res) => {
    db.all('SELECT * FROM todos', [], (err, rows) => {
        if (err) {
            console.error('Error retrieving data:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Retrieved todos:', rows); // แสดงข้อมูลในคอนโซล
        res.json({ todos: rows });
    });
});

// เพิ่มรายการงานใหม่
app.post('/todos', (req, res) => {
    const { task } = req.body;
    if (!task) {
        res.status(400).json({ error: 'Task is required' });
        return;
    }
    db.run(
        'INSERT INTO todos (task, completed) VALUES (?, ?)', [task, false],
        function(err) {
            if (err) {
                console.error('Error inserting todo:', err.message);
                res.status(400).json({ error: err.message });
                return;
            }
            console.log('Inserted todo:', { id: this.lastID, task, completed: false }); // แสดงข้อมูลในคอนโซล
            res.json({ id: this.lastID, task, completed: false });
        }
    );
});

// อัปเดตรายการงาน
app.put('/todos/:id', (req, res) => {
    const { task, completed } = req.body;
    const { id } = req.params;
    if (!task || completed == null) {
        res.status(400).json({ error: 'Task and completed status are required' });
        return;
    }
    db.run(
        'UPDATE todos SET task = ?, completed = ? WHERE id = ?', [task, completed, id],
        function(err) {
            if (err) {
                console.error('Error updating todo:', err.message);
                res.status(400).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'No todo found with that ID' });
                return;
            }
            console.log('Updated todo:', { updatedID: id, task, completed }); // แสดงข้อมูลในคอนโซล
            res.json({ updatedID: id, task, completed });
        }
    );
});

// ลบรายการงาน
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM todos WHERE id = ?', id, function(err) {
        if (err) {
            console.error('Error deleting todo:', err.message);
            res.status(400).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'No todo found with that ID' });
            return;
        }
        console.log('Deleted todo ID:', id); // แสดงข้อมูลในคอนโซล
        res.json({ deletedID: id });
    });
});

// จัดการคำขอที่ไม่มีเส้นทาง
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});