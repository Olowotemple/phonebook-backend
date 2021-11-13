const mongoose = require('mongoose');
const { MONGODB_URI } = process.env;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Server is now connected to mongodb\n'))
  .catch((error) => void console.error(error));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString();

    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
