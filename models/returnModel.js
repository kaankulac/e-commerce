const sequelize = require('../utility/database.js');
const Model = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');


const Return = sequelize.define('Return',{
    orderId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    cause:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports = Return