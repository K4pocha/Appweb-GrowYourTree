const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;
const usersFile = 'users.json';

app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile));

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.status(200).send({ username: user.username });
  } else {
    res.status(401).send({ message: 'Invalid credentials' });
  }
});

app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile));

  if (users.find(u => u.username === username)) {
    return res.status(400).send({ message: 'User already exists' });
  }

  users.push({ username, password, email });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.status(201).send({ username });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


