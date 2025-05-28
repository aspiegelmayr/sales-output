const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/api/outputs', (req, res) => {
  const { week, startWeek, endWeek } = req.query;
  let outputs;
  if (week) {
    const stmt = db.prepare('SELECT * FROM outputs WHERE weekOfTheYear = ?');
    outputs = stmt.all(Number(week));
  } else if (startWeek && endWeek) {
    const stmt = db.prepare(`
      SELECT * FROM outputs 
      WHERE weekOfTheYear BETWEEN ? AND ?
    `);
    outputs = stmt.all(Number(startWeek), Number(endWeek));
  } else {
    const stmt = db.prepare('SELECT * FROM outputs');
    outputs = stmt.all();
  }
  res.json(outputs);
});

app.get('/api/outputs', (req, res) => {
  const { date, startDate, endDate } = req.query;
  let outputs;
  if (date) {
    const stmt = db.prepare('SELECT * FROM outputs WHERE DATE = ?');
    outputs = stmt.all(Date(date));
  } else if (startDate && endDate) {
    const stmt = db.prepare(`
      SELECT * FROM outputs 
      WHERE date BETWEEN ? AND ?
    `);
    outputs = stmt.all(Date(startDate), Date(endDate));
  } else {
    const stmt = db.prepare('SELECT * FROM outputs');
    outputs = stmt.all();
  }
  res.json(outputs);
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
  let outputs = req.body;

  if (!Array.isArray(outputs)) {
    outputs = [outputs];
  }

  const results = [];

  const stmt = db.prepare(`
    INSERT INTO outputs 
      (name, availability, newOpps, currentChances, details, projectStarts, newEntries, contracts, kvts, note, weekOfTheYear, date) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((outputs) => {
    for (const output of outputs) {
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
        output.weekOfTheYear,
        output.date
      );
      results.push({ id: info.lastInsertRowid, ...output });
    }
  });

  insertMany(outputs);

  res.status(201).json(results);
});





app.get('/api/people', (req, res) => {
  const stmt = db.prepare('SELECT * FROM people');
  people = stmt.all();
  res.json(people);
});

app.post('/api/people', (req, res) => {
  let persons = req.body;

  if (!Array.isArray(persons)) {
    persons = [persons];
  }

  const results = [];
  const stmt = db.prepare('INSERT INTO people (name, availability) VALUES (?, ?)');

  const insertMany = db.transaction((people) => {
    for (const person of people) {
      const info = stmt.run(person.name, person.availability);
      results.push({ id: info.lastInsertRowid, ...person });
    }
  });

  insertMany(persons);

  res.status(201).json(results);
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

app.patch('/api/people/:id', (req, res) => {
  const id = req.params.id;
  const fields = req.body;

  const keys = Object.keys(fields);
  if (keys.length === 0) {
    return res.status(400).json({ error: 'No fields provided to update.' });
  }

  const setClause = keys.map(key => `${key} = ?`).join(', ');
  const values = keys.map(key => fields[key]);

  const stmt = db.prepare(`UPDATE people SET ${setClause} WHERE id = ?`);
  const info = stmt.run(...values, id);

  if (info.changes > 0) {
    const selectStmt = db.prepare('SELECT * FROM people');
    const updatedPeople = selectStmt.all();
    res.json({ updatedPeople });
  } else {
    res.status(404).json({ error: `Entry with id ${id} not found.` });
  }
});


app.get('/api/periods', (req, res) => {
  const stmt = db.prepare('SELECT * FROM periods');
  periods = stmt.all();
  res.json(periods);
});

app.post('/api/periods', (req, res) => {
  let periods = req.body;

  if (!Array.isArray(periods)) {
    periods = [periods];
  }

  const results = [];
  const stmt = db.prepare('INSERT INTO periods (name, startWeek, endWeek) VALUES (?, ?, ?)');

  const insertMany = db.transaction((periods) => {
    for (const period of periods) {
      const info = stmt.run(period.name, period.startWeek, period.endWeek);
      results.push({ id: info.lastInsertRowid, ...period });
    }
  });

  insertMany(periods);

  res.status(201).json(results);
});

app.patch('/api/periods/:id', (req, res) => {
  const id = req.params.id;
  const fields = req.body;

  const keys = Object.keys(fields);
  if (keys.length === 0) {
    return res.status(400).json({ error: 'No fields provided to update.' });
  }

  const setClause = keys.map(key => `${key} = ?`).join(', ');
  const values = keys.map(key => fields[key]);

  const stmt = db.prepare(`UPDATE periods SET ${setClause} WHERE id = ?`);
  const info = stmt.run(...values, id);

  if (info.changes > 0) {
    const selectStmt = db.prepare('SELECT * FROM periods');
    const updatedPeriods= selectStmt.all();
    res.json({ updatedPeriods });
  } else {
    res.status(404).json({ error: `Entry with id ${id} not found.` });
  }
});

app.delete('/api/periods/:id', (req, res) => {
  const id = req.params.id;

  const stmt = db.prepare('DELETE FROM periods WHERE id = ?');
  const info = stmt.run(id);

  if (info.changes > 0) {
    const selectStmt = db.prepare('SELECT * FROM periods');
    const updatedPeriods = selectStmt.all();
    res.status(200).json({ updatedPeriods });
  } else {
    res.status(404).json({ error: `Entry with id ${id} not found.` });
  }
});


app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

