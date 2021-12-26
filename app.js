const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const sequelize = require('./utility/database');
const bodyParser = require('body-parser');
const managementRouter = require('./routes/managementRouter.js');
const userRouter = require('./routes/userRouter.js');
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const mainRouter = require('./routes/mainRouter.js');
const adminRouter = require('./routes/adminRouter.js');




app.engine('.ejs',ejs.__express);
app.set('views',__dirname+'/views');
app.use(express.static(__dirname + '/public'));
app.use(managementRouter);
app.use(userRouter);
app.use(adminRouter);
app.use(mainRouter);
app.use(bodyParser.urlencoded({extended:true}));

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });





app.listen(8000,()=>{
    console.log('Listening on port 8000');
});
