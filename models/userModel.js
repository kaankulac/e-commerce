const sequelize = require('../utility/database.js');
const Model = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');

const User = sequelize.define('User',{
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    fullName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    adress:{
        type:DataTypes.STRING,
        allowNull:true
    }

});

module.exports = User;