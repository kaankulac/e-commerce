const sequelize = require('../utility/database.js');
const Model = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');

const paymentMethod = sequelize.define('paymentMethod',{
    cardNumber:{
        type:DataTypes.STRING,
        allowNull:false
    },
    cvv:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    expritionDate:{
        type:DataTypes.STRING,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    isSeller:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
})

module.exports = paymentMethod;