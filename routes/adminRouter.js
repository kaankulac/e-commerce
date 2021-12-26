const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const adminController = require('../controllers/adminController.js');

router.use(bodyParser.urlencoded({extended:true}));

router.get('/admin/categories/add',adminController.categoryAddGet);
router.post('/admin/categories/add',adminController.categoryAddPost);


module.exports = router;