require('dotenv').config();
require('./mongo');

const express = require('express');
// Routes
const usersRouter = require('./routes/users');
const transactionsRouter = require('./routes/transactions');
const risksRouter = require('./routes/risks');

const { json } = express;
const app = express();

// Middlewares
app.use(json());

app.use('/import', express.static('public'));

app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/risks', risksRouter);

const PORT = process.env.PORT || 3100;
const server = app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});

module.exports = {
  app,
  server
};