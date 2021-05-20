const formidable = require('formidable');
const XLSX = require('xlsx');

/* TASKS
  - Convertir DNI en String

*/

const formatUsers = (req, res, next) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      // next(err);
      return;
    }
    const { file } = files;
    const wb = XLSX.readFile(file.path);
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const unorderedUsers = XLSX.utils.sheet_to_json(sheet);
    const users = [];
    const transactions = [];
    unorderedUsers.forEach(unorderUser => {
      const userIdx = users.findIndex(user => user.dni === unorderUser.dni);
      if (transactions.findIndex(transaction => transaction === unorderUser.transaction) === -1) {
        transactions.push(unorderUser.transaction);
      }
      
      if (userIdx === -1) {
        // Add new user
        const { transaction, ...user } = unorderUser;
        users.push({
          ...user,
          transactions: [transaction]
        });
      } else {
        // Update existing users
        const { transactions: userTransactions } = users[userIdx];
        const idx = userTransactions.findIndex(transaction => transaction === unorderUser.transaction);
        if (idx === -1) {
          userTransactions.push(unorderUser.transaction);
        }
      }
    });
    req.body = { users, transactions };
    next();
  });
};

module.exports = formatUsers;