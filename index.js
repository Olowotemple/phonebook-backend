require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

morgan.token('body', (req) => JSON.stringify(req.body));

const errorHandler = (error, req, res, next) => {
  console.error(error);
  next(error);
};

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/api/persons', async (_, res) => {
  const persons = await Person.find({});
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

app.post('/api/persons', async (req, res) => {
  const { name, number } = req.body;
  const persons = await Person.find({});

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

  const person = new Person({
    name,
    number,
  });

  const returnedPerson = await person.save();
  res.json(returnedPerson);
});

app.delete('/api/persons/:id', async (req, res) => {
  const { id } = req.params;
  const person = await Person.findByIdAndRemove(id);
  if (person) {
    return res.status(204).end();
  }
  res.status(404).end();
});

app.put('/api/persons/:id', async (req, res) => {
  const { id } = req.params;
  const { name, number } = req.body;

  const person = {
    name,
    number,
  };

  const updatedPerson = await Person.findByIdAndUpdate(id, person, {
    new: true,
  });
  res.json(updatedPerson);
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(
  PORT,
  () => void console.log(`Server is now listening on PORT ${PORT}`)
);
