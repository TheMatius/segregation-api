const getAll = (req, res) => {
  res.json('OK');
};

const usersDB = [
  {
    id: 1,
    username: 'mmonsalve',
    name: 'Mateo',
    lastname: 'Monsalve',
    transactions: [
      'AFAS23'
    ]
  },
  {
    id: 2,
    username: 'mcardona',
    name: 'Mauricio',
    lastname: 'Cardona',
    transactions: [
      'AFAS23'
    ]
  },
  {
    id: 4,
    username: 'jvanegas',
    name: 'Julieta',
    lastname: 'Vanegas',
    transactions: [
      'AFAS23'
    ]
  },
  {
    id: 5,
    username: 'jgonzales',
    name: 'Jaime',
    lastname: 'Gonzales',
    transactions: [
      'AFAS23'
    ]
  }
];

const importUsers = (req, res) => {
  const users = req.body;
  // Get all users from DB
  const modifiedUsers = [];
  users.forEach((user) => {
    const userIdx = usersDB.findIndex(userDB => userDB.id === user.id);
    if (userIdx === -1) {
      // Add new user to DB
      console.log('Creating user');
      modifiedUsers.push(user);
    } else {
      // Update user from DB
      const { transactions, ...userDB } = usersDB[userIdx];
      const updatedTransactions = user.transactions.filter(transaction =>
        (transactions.findIndex(transactionDB => transactionDB === transaction) === -1)
          ? true
          : false
      );
      const userToUpdate = {
        ...userDB,
        transactions: [...transactions, ...updatedTransactions]
      };
      modifiedUsers.push(userToUpdate);
    }
  });
  
  res.json({
    ok: true,
    modifiedUsers 
  });
};

module.exports = {
  getAll,
  importUsers
};