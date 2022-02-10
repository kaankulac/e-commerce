const sequelize = require('../utility/database.js');
const Model = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');


const Tag = sequelize.define('Tag',{
    productId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    tag:{
        type:DataTypes.STRING,
        allowNull:false
    },
})


module.exports = Tag;