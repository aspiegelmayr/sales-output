const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

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

app.patch('/api/outputs/:id', (req, res) => {
  const id = req.params.id;
  const fields = req.body;

  const keys = Object.keys(fields);
  if (keys.length === 0) {
    return res.status(400).json({ error: 'No fields provided to update.' });
  }

  const setClause = keys.map(key => `${key} = ?`).join(', ');
  const values = keys.map(key => fields[key]);

  const stmt = db.prepare(`UPDATE outputs SET ${setClause} WHERE id = ?`);
  const info = stmt.run(...values, id);

  if (info.changes > 0) {
    const updated = db.prepare('SELECT * FROM outputs').all();
    res.json({ updatedOutputs: updated });
  } else {
    res.status(404).json({ error: `Output with id ${id} not found.` });
  }
});

app.post('/api/outputs', (req, res) => {
  const output = req.body;

  const stmt = db.prepare(`
      INSERT INTO outputs 
        (name, availability, newOpps, currentChances, details, projectStarts, newEntries, contracts, kvts, note, weekOfTheYear)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

  try {
    const info = stmt.run(
      output.name,
      output.availability,
      output.newOpps,
      output.currentChances,
      output.details,
      output.projectStarts,
      output.newEntries,
      output.contracts,
      output.kvts,
      output.note,
      output.weekOfTheYear
    );

    const inserted = { id: info.lastInsertRowid, ...output };
    res.json(inserted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to insert output.', details: err.message });
  }
});




app.get('/api/people', (req, res) => {
  const stmt = db.prepare('SELECT * FROM people');
  people = stmt.all();
  res.json(people);
});

app.post('/api/people', (req, res) => {
  const persons = req.body;
  const results = [];

  const stmt = db.prepare('INSERT INTO people (name, availability) VALUES (?, ?)');

  const insertMany = db.transaction((people) => {
    for (const person of people) {
      const info = stmt.run(person.name, person.availability);
      results.push({ id: info.lastInsertRowid, ...person });
    }
  });
  insertMany(persons);

  res.json(results);
});

app.post('/api/people', (req, res) => {
  const person = req.body;
  const stmt = db.prepare('INSERT INTO people (name, availability) VALUES (?, ?)');
  const info = stmt.run(person);

  res.status(201).json({ id: info.lastInsertRowid, ...person });
});

app.delete('/api/people/:id', (req, res) => {
  const id = req.params.id;

  const stmt = db.prepare('DELETE FROM people WHERE id = ?');
  const info = stmt.run(id);

  if (info.changes > 0) {
    const selectStmt = db.prepare('SELECT * FROM people');
    const updatedPeople = selectStmt.all();
    res.status(200).json({ updatedPeople });
  } else {
    res.status(404).json({ error: `Entry with id ${id} not found.` });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

