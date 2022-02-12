const express = require('express');
const router = express.Router();
const managementController = require('../controllers/managementController.js');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);

router.use(bodyParser.urlencoded({extended:true}));
var options = {
	host: 'localhost',
	user: 'root',
	password: '234234234k',
	database: 'trade',
  createDatabaseTable: true,
  scheme:{
    tableName:'session',
    columnNames:{
      session_id:'session_id',
      expires:'expires',
      data:'data'
    }
  }

};

var store = new mysqlStore(options);

router.use(session({
	secret: 'keybord cat',
	store: store,
  cookie:{
    maxAge:60000*60,
  },
  resave:false,
  saveUninitialized:false,

}));
router.get('/management',managementController.managementGet);
router.post('/management/:request/:request2/:id',managementController.managementPost);
router.post('/management/:request/:request2',managementController.managementPost);




module.exports = router;
