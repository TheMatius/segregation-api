const { Router } = require('express');
// Controller
const { getAll, importUsers } = require('../controllers/users');
// Middlewares
const formatUsers = require('../middlewares/formatUsers');

const router = Router();

router.get('/', getAll);
router.post('/import', formatUsers, importUsers);

module.exports = router;