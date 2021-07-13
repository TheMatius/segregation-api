const User = require('../models/User');

const insertManyUsers = (users) => {
  if (!users || users.length == 0) return Promise.resolve([]);
  const usersToAdd = users.map((user) => {
    const { dni, username, name, lastname, transactions } = user;
    const userDB = new User({
      dni,
      username,
      name,
      lastname,
      transactions
    });

    return userDB.save();
  });

  return Promise.allSettled(usersToAdd).then((data) => data.map((el) => el.value));
};

const updateManyUsers = (users, usersDB) => {
  if (!users || users.length === 0 ||
    !usersDB || usersDB.length === 0) return Promise.resolve([]);
  const usersToUpdate = users.map((user) => {
    const { dni, transactions } = user;
    const userDB = usersDB.find((u) => u.dni === dni);
    const { transactions: transactionsDB } = userDB;
    const newTransactions = transactions.filter(transaction => 
      transactionsDB.findIndex(t => t === transaction) === -1
    );
    userDB.transactions = [...transactionsDB, ...newTransactions];
    return userDB.save();
  });

  return Promise.allSettled(usersToUpdate).then((data) => data.map((el) => el.value));
};

module.exports = {
  insertManyUsers,
  updateManyUsers
};