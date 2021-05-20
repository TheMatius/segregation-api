const { Router } = require('express');
// Controller
const { getAll, importUsers } = require('../controllers/users');
// Middlewares
const formatUsers = require('../middlewares/formatUsers');
const transactionsCheck = require('../middlewares/transactionsCheck');

const router = Router();

router.get('/', getAll);
router.post('/import', [formatUsers, transactionsCheck], importUsers);

module.exports = router;