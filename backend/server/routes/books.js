const express = require('express');
const router = express.Router();
const controller = require('../controllers/booksController');

router.get('/', controller.getBooks);
router.post('/', controller.createBook);

module.exports = router;