const { Schema, model } = require('mongoose');

const riskSchema = new Schema({
  transactionOne: { type: String, required: true },
  transactionTwo: { type: String, required: true },
  name: String,
  description: String
});

riskSchema.virtual('transactionOnePopulated', {
  ref: 'Transaction',
  localField: 'transactionOne',
  foreignField: 'code',
  justOne: true
});

riskSchema.virtual('transactionTwoPopulated', {
  ref: 'Transaction',
  localField: 'transactionTwo',
  foreignField: 'code',
  justOne: true
});

riskSchema.set(('toObject'), {
  virtuals: true 
});

riskSchema.set(('toJSON'), {
  transform: (doc, risk) => {
    const {
      _id: id,
      // eslint-disable-next-line no-unused-vars
      __v,
      transactionOnePopulated,
      transactionTwoPopulated,
      transactionOne,
      transactionTwo,
      ...args
    } = risk;

    const newRisk = {
      transactionOne: transactionOnePopulated || transactionOne, 
      transactionTwo: transactionTwoPopulated || transactionTwo,
      ...args
    };
    return (!id) ? newRisk : { id, ...newRisk };
  },
  virtuals: true
});

const Risk = model('Risk', riskSchema);

module.exports = Risk;