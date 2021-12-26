const sequelize = require('../utility/database.js');
const Model = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');


const Store = sequelize.define('Store',{
    storeName:{
        type:DataTypes.STRING,
        allowNull: false
    },
    joinID:{
        type:DataTypes.INTEGER,
        allowNull: false
    },
    pathName:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    rating:{
        type:DataTypes.INTEGER,
        allowNull:true
    }

});

module.exports = Store;
