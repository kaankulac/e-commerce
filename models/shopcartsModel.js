const sequelize = require('../utility/database.js');
const Model = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');

const Shopcart = sequelize.define('Shopcart',{
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    productId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    totalPrice:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
});

module.exports = Shopcart;