const sequelize = require('../utility/database.js');
const Model = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');

const Image = sequelize.define('Image',{
    productId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    imageUrl:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports = Image;