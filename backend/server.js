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
    note: 'Some note',
    weekOfTheYear: 1
}]

app.get('/api', (req, res) => {
    res.json(employeeMock);
});

app.get('/api/outputs', (req, res) => {
  const week = req.query.week;

  let outputs;
  if (week) {
    const stmt = db.prepare('SELECT * FROM outputs WHERE weekOfTheYear = ?');
    outputs = stmt.all(Number(week));
  } else {
    const stmt = db.prepare('SELECT * FROM outputs');
    outputs = stmt.all();
  }

  res.json(outputs);
});

app.post('/api/outputs', (req, res) => {
    const outputs = req.body; 
  const results = [];

  const stmt = db.prepare('INSERT INTO outputs (name, availability, newOpps, currentChances, details, projectStarts, newEntries, contracts, kvts, note, weekOfTheYear) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

  const insertMany = db.transaction((emps) => {
    for (const emp of emps) {
      const info = stmt.run(emp.name, emp.availability, emp.newOpps, emp.currentChances, emp.details, emp.projectStarts, emp.newEntries, emp.contracts, emp.kvts, emp.note, emp.weekOfTheYear);
      results.push({ id: info.lastInsertRowid, ...emp });
    }
    });
    insertMany(outputs);

  res.json(results);
  });

  app.delete('/api/outputs/:id', (req, res) => {
    const id = req.params.id;
  
    const stmt = db.prepare('DELETE FROM outputs WHERE id = ?');
    const info = stmt.run(id);
  
    if (info.changes > 0) {
      const selectStmt = db.prepare('SELECT * FROM outputs');
      const updatedOutputs = selectStmt.all();
      res.status(200).json({ outputs: updatedOutputs });
    } else {
      res.status(404).json({ error: `Output with id ${id} not found.` });
    }
  });

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});

