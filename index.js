require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

morgan.token('body', (req) => JSON.stringify(req.body));

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    const { name, number } = error.errors;
    return res.status(400).json({ error: `${name || number}` });
  }
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

app.get('/api/persons/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const person = await Person.findById(id);

    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

app.get('/info', async (_, res) => {
  const persons = await Person.find({});
  res.send(
    `
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    `
  );
});

app.post('/api/persons', async (req, res, next) => {
  const { name, number } = req.body;

  if (!name) {
    return res.status(400).json({
      error: 'name cannot be blank',
    });
  }

  if (!number) {
    return res.status(400).json({
      error: 'number cannot be blank',
    });
  }

  try {
    const person = new Person({
      name,
      number,
    });
    const returnedPerson = await person.save();
    res.json(returnedPerson);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/persons/:id', async (req, res) => {
  const { id } = req.params;
  const person = await Person.findByIdAndRemove(id);
  if (person) {
    return res.status(204).end();
  }
  res.status(404).end();
});

app.put('/api/persons/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;

  const person = {
    name,
    number,
  };

  try {
    const updatedPerson = await Person.findByIdAndUpdate(id, person, {
      new: true,
      runValidators: true,
    });
    res.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(
  PORT,
  () => void console.log(`Server is now listening on PORT ${PORT}`)
);
