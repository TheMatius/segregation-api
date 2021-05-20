const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  dni: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  name: String,
  lastname: String,
  transactions: [String]
});

userSchema.virtual('transactionList', {
  ref: 'Transaction',
  localField: 'transactions',
  foreignField: 'code'
});

userSchema.set('toObject', { virtuals: true });

userSchema.set('toJSON', {
  transform: (doc, user) => {
    // eslint-disable-next-line no-unused-vars
    const { _id: id, __v, transactionList, ...args } = user;
    if (transactionList) {
      return { ...args, transactions: transactionList };
    }
    return { id, ...args };
  },
  virtuals: true
});

const User = model('User', userSchema);

module.exports = User;