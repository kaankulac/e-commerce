const Sequelize = require('sequelize');
const sequelize = new Sequelize('trade','root','234234234k',{
    dialect:'mysql',
    host:'localhost'
});

module.exports = sequelize;