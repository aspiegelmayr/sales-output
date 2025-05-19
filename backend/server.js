const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

employeeMock = [{
    id: 1,
    name: 'Anton',
    availability: 1,
    newOpps: 1,
    currentChances: 3,
    details: 'Some details',
    projectStarts: 2,
    newEntries: 1,
    contracts: 2,
    kvts: 3,
    note: 'Some note'
}]

app.get('/api', (req, res) => {
    res.json(employeeMock);
});

app.get('/api/employees', (req, res) => {
    const employees = db.prepare('SELECT * FROM employees').all();
    res.json(employees);
});

app.post('/api/employees', (req, res) => {
    const employees = req.body; 
  const results = [];

  const stmt = db.prepare('INSERT INTO employees (name, availability, newOpps, currentChances, details, projectStarts, newEntries, contracts, kvts, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

  const insertMany = db.transaction((emps) => {
    for (const emp of emps) {
      const info = stmt.run(emp.name, emp.availability, emp.newOpps, emp.currentChances, emp.details, emp.projectStarts, emp.newEntries, emp.contracts, emp.kvts, emp.note);
      results.push({ id: info.lastInsertRowid, ...emp });
    }
    });
    insertMany(employees);

  res.json(results);
  });

  app.delete('/api/employees/:id', (req, res) => {
    const id = req.params.id;
  
    const stmt = db.prepare('DELETE FROM employees WHERE id = ?');
    const info = stmt.run(id);
  
    if (info.changes > 0) {
      const selectStmt = db.prepare('SELECT * FROM employees');
      const updatedEmployees = selectStmt.all();
      res.status(200).json({ employees: updatedEmployees });
    } else {
      res.status(404).json({ error: `Employee with id ${id} not found.` });
    }
  });

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});

