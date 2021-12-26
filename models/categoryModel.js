const sequelize = require('../utility/database.js');
const Model = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');


const Category = sequelize.define('Category',{
    categoryName:{
        type:DataTypes.STRING
    }
})


module.exports = Category;