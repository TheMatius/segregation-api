const { Schema, model } = require('mongoose');

const transactionSchema = new Schema({
  code: { type: String, required: true, unique: true },
  name: String,
  description: String
});

transactionSchema.set(('toJSON'), {
  transform: (doc, transaction) => {
    // eslint-disable-next-line no-unused-vars
    const { _id: id, __v, ...args } = transaction;
    return { id, ...args };
  }
});

const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;