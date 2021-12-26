const sequelize = require('../utility/database.js');
const Model = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');

const Message = sequelize.define('Message',{
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    storeId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    isAnswer:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    message:{
        type:DataTypes.STRING,
        allowNull:false
    },
    orderId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
})

module.exports = Message;