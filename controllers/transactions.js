
const Transaction = require('../models/Transaction');

const getAll = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({});
    res.json({
      ok: true,
      transactions
    });
  } catch (err) {
    next(err);    
  }
};

const create = async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const transaction = new Transaction({
      code,
      name,
      description
    });
    const savedTransaction = await transaction.save();
    
    res.status(201).json({
      ok: true,
      transaction: savedTransaction
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description  } = req.body;

    const updatedTransaction = await Transaction.findOneAndUpdate(id, { name, description }, { new: true });
    res.json({
      ok: true,
      transaction: updatedTransaction
    });
  } catch (err) {
    next(err);
  }
};

const remove =  async (req, res, next) => {
  try {
    const { id } = req.params;
    await Transaction.findOneAndRemove(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove
};