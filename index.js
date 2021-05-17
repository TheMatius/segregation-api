const express = require('express');

const usersRouter = require('./routes/users');

const { json } = express;
const app = express();

// Middlewares
app.use(json());

app.get('/api/users', usersRouter);

const PORT = process.env.PORT || 3100;
const server = app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});

module.exports = {
  app,
  server
};