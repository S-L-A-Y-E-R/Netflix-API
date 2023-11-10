const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

//Handling uncaught errors
// process.on('uncaughtException', err => {
//   console.log(err.name, err.message);
//   process.exit(1);
// });

mongoose.connect(process.env.DATABASE).then(console.log('Connected to database'));

const app = require('./app');

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

//Handling global rejection errors
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});

