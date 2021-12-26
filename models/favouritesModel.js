const sequelize = require('../utility/database.js');
const Model = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');

const Favourite = sequelize.define('Favourite',{
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    productId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    isChecked:{
        type:DataTypes.BOOLEAN,
        allowNull:true
    }
});

module.exports = Favourite;