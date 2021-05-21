const { Router } = require('express');
// Controller
const { 
  getAll,
  getById,
  getRisksByUserId,
  create,
  importUsers,
  update,
  remove
} = require('../controllers/users');
// Middlewares
const formatUsers = require('../middlewares/formatUsers');
const transactionsCheck = require('../middlewares/transactionsCheck');

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.get('/risks/:id', getRisksByUserId);
router.post('/', create);
router.post('/import', [formatUsers, transactionsCheck], importUsers);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;