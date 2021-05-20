const User = require('../models/User');

const getAll = async (req, res, next) => {
  try {
    const users = await User.find({}).populate('transactionList', { _id: 0 });
    res.json({
      ok: true,
      users
    });
  } catch (err) {
    next(err);
  }
};

const importUsers = async (req, res, next) => {
  try {
    const { users } = req.body;

    if (!users || users.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'No se ha recibido usuarios.'
      });
    }
    const userIds = users.map(user => user.dni);
    // Obtener los usuarios existentes de la BD
    const usersDB = await User.find({ dni: { $in: userIds } });
  
    const oldUsers = [];
    const newUsers = [];
    let updatedUsers = [];
    let createdUsers = [];
    // Filtrar los usuarios a actualizar y a crear
    users.forEach(user => (usersDB.findIndex(u => u.dni === user.dni) > -1)
      ? oldUsers.push(user)
      : newUsers.push(user)
    );
    // Actualizando usuarios
    if (oldUsers && oldUsers.length > 0) {
      const users = oldUsers.map(async (user) => {
        const idx = usersDB.findIndex(u => u.dni === user.dni);
        const userDB = usersDB[idx];
        const { transactions: transactionsDB } = userDB;
        const { transactions: userTransactions } = user;
        const newTransactions = userTransactions.filter(transaction => 
          transactionsDB.findIndex(t => t === transaction) === -1
        );
        userDB.transactions = [...transactionsDB, ...newTransactions];
        return await userDB.save();
      });
  
      if (users) {
        updatedUsers = await Promise.all(users);
      }
    }
    // Creando nuevos usuarios
    if (newUsers && newUsers.length > 0) {
      const users = newUsers.map(async (user) => {
        const { dni, username, name, lastname, transactions } = user;
        const userDB = new User({
          dni,
          username,
          name,
          lastname,
          transactions
        });
  
        return await userDB.save();
      });
  
      if (users){
        createdUsers = await Promise.all(users);
      }
    }
  
    // Se envian los usuarios creados y actualizados al importar los datos.
    res.json({
      ok: true,
      updatedUsers,
      createdUsers
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  importUsers
};