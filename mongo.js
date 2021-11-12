const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the necessary arguments: node mongo.js <password> <name?> <number?>'
  );
  process.exit(1);
}

const [, , password, name, number] = process.argv;

const url = `mongodb+srv://admin:${password}@phonebook-main.vif8g.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose
  .connect(url)
  .then(() => console.log('Server is now connected to mongodb\n'))
  .catch((error) => void console.error(error));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) {
  const person = new Person({
    name,
    number,
  });
  person.save().then(({ name, number }) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Person.find({}).then((people) => {
    console.log('phonebook:');
    people.forEach(({ name, number }) => console.log(`${name} ${number}`));
    mongoose.connection.close();
  });
}
