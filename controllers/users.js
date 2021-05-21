const User = require('../models/User');
const Risk = require('../models/Risk');

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

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json({
      ok: true,
      user
    });
  } catch (err) {
    next(err);
  }
};

const getRisksByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const { transactions } = user;

    //Populate multiple fields
    const populateQuery = [
      { path: 'transactionOnePopulated', select:'-_id' },
      { path: 'transactionTwoPopulated', select:'-_id' }
    ];
    const allRisks = await Risk.find({}).populate(populateQuery);

    // El diccionario risksEnum funciona ingresando el par de transacciones que referencia el idx en el array de riesgos
    // T1-T2: 0 , T3-T4: 1 -> devuelve el idx donde se encuentra el riesgo
    const risksEnum = {};
    // Este arreglo permite convertir los riesgos al JSON de modelo y crear un diccionario en risksEnum
    const risksDB = allRisks.map((riskDB, idx) => {
      const risk = riskDB.toJSON();
      const { transactionOne, transactionTwo } = risk;
      const riskDuple = `${transactionOne.code}-${transactionTwo.code}`;
      risksEnum[riskDuple] = idx;
      return risk;
    });

    const risks = [];
    for (let i = 0; i < transactions.length-1; i++) {
      for (let j = 1+i; j <= transactions.length-1; j++) {
        const tuple = `${transactions[i]}-${transactions[j]}`;
        const reversedTuple = `${transactions[j]}-${transactions[i]}`;
        //Nullish coalescing operator -> Si alguno de los valores es undefined o null
        const riskIdx = risksEnum[`${tuple}`] ?? risksEnum[`${reversedTuple}`] ?? -1;
        if (riskIdx !== -1) {
          const risk = risksDB[riskIdx];
          risks.push(risk);
        }
      }
    }
    res.json({
      ok: true,
      risks
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const user = req.body;

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: 'No se ha recibido el usuario.'
      });
    }
    const { dni, username, name, lastname, transactions } = user;
    const userDB = new User({
      dni,
      username,
      name,
      lastname,
      transactions
    });
    const createdUser = await userDB.save();
    res.status(201).json({
      ok: true,
      user: createdUser
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

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.body;

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: 'No se ha recibido el usuario.'
      });
    }
    const { name, lastname, transactions } = user;

    const userDB = await User.findOneAndUpdate(id, { name, lastname, transactions }, { new: true });
    res.json({
      ok: true,
      user: userDB
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await User.findOneAndRemove(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  getRisksByUserId,
  create,
  importUsers,
  update,
  remove
};