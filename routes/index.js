var express = require('express');
var router = express.Router();
const { getDailyTransfersData } = require('../controllers/transactionController');

/* GET home page with transfer count data */
router.get('/', getDailyTransfersData);

module.exports = router;