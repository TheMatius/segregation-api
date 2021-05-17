const { Router } = require('express');
//Controller
const { getAll } = require('../controllers/users');

const router = Router();

router.get('/', getAll);

module.exports = router;