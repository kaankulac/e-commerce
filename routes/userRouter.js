const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
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

router.get('/register',userController.userRegisterGet);
router.post('/register',userController.userRegisterPost);

router.get('/login',userController.userLoginGet);
router.post('/login',userController.userLoginPost);


router.post('/profile/password/change',userController.passwordChangePost);

router.get('/profile',userController.profilePageGet);

router.post('/profile/adress/:action/',userController.changeAdressPost);

router.get('/profile/change/email',userController.changeEmailGet);
router.post('/profile/change/email',userController.changeEmailPost);

router.get('/profile/change/paymentmethod',userController.addPaymentMethodGet);
router.post('/profile/change/paymentmethod',userController.addPaymentMethodPost);

router.post('/profile/change/paymentmethod/delete',userController.deletePaymentMethodPost);







module.exports = router;