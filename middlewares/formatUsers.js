const formidable = require('formidable');
const XLSX = require('xlsx');

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
    unorderedUsers.forEach(unorderUser => {
      const userIdx = users.findIndex(user => user.id === unorderUser.id);
      if (userIdx === -1) {
        // Add new user
        const { transaction, ...user } = unorderUser;
        users.push({
          ...user,
          transactions: [transaction]
        });
      } else {
        // Update existing users
        const { transactions } = users[userIdx];
        const idx = transactions.findIndex(transaction => transaction === unorderUser.transaction);
        if (idx === -1) {
          transactions.push(unorderUser.transaction);
        }
      }
    });
    req.body = users;
    next();
  });
};

module.exports = formatUsers;