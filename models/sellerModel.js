const sequelize = require('../utility/database.js');
const Model = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');


const Seller = sequelize.define('Seller',{
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    storeId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    adress:{
        type:DataTypes.STRING,
        allowNull:true
    }
});

module.exports = Seller;