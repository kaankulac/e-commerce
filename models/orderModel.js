const sequelize = require('../utility/database.js');
const Model = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');

const Order = sequelize.define('Order',{

    totalPrice:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    isDone:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    productId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    storeId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    isCancelled:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    isComment:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    isReturned:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    cancelFrom:{
        type:DataTypes.STRING,
        allowNull:true
    }
});

module.exports = Order;