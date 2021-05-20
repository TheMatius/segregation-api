const Transaction = require('../models/Transaction');

const transactionsCheck = async (req, res, next) => {
  const { transactions } = req.body;

  if (!transactions || transactions.length === 0) {
    return res.status(400).json({ 
      ok: false,
      error: 'No se han recibido transacciones.',
    });
  }

  let transactionsDB = await Transaction.find({ code: { $in: transactions } }, { _id: 0, code: 1 });
  transactionsDB = transactionsDB.map(transaction => transaction.code);
  const unregisteredTransactions = transactions.filter(transaction => transactionsDB.findIndex(t => t === transaction) === -1);
  
  if (unregisteredTransactions && unregisteredTransactions.length > 0) {
    return res.status(404).json({ 
      ok: false,
      error: 'No se han encontrado las transacciones en la base de datos.',
      transactions: unregisteredTransactions
    });
  }

  next();
};

module.exports = transactionsCheck;