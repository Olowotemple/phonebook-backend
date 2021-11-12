const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

morgan.token('body', (req) => JSON.stringify(req.body));

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.use(cors());
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/api/persons', (_, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params;
  const person = persons.find((person) => person.id === +id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get('/info', (_, res) => {
  res.send(
    `
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    `
  );
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  const generateId = () => {
    const maxID =
      persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
    return maxID + 1;
  };

  if (!name) {
    return res.status(404).json({
      error: 'name cannot be blank',
    });
  }

  if (!number) {
    return res.status(404).json({
      error: 'number cannot be blank',
    });
  }

  if (persons.some((person) => person.name === name)) {
    return res.status(404).json({
      error: 'name must be unique',
    });
  }

  const person = {
    name,
    number,
    id: generateId(),
  };

  persons = [...persons, person];
  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const { id } = req.params;
  persons = persons.filter((person) => person.id !== +id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(
  PORT,
  () => void console.log(`Server is now listening on PORT ${PORT}`)
);
