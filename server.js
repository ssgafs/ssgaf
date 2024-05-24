/* jshint esversion: 6 */
/* jshint node: true */
/* jshint bitwise: false */
'use strict';

const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;


let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});


db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)');
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error registering user');
    } else {
      res.redirect('/login.html');
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error logging in');
    } else if (row) {
      res.redirect('/profile.html');
    } else {
      res.status(401).send('Invalid username or password');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
