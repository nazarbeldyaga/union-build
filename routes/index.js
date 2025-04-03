var express = require('express');
var router = express.Router();
const { getControllerData } = require('../controllers/controller');

/* GET home page with transfer count data */
router.get('/', getControllerData);

module.exports = router;