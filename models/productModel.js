const sequelize = require('../utility/database.js');
const Model = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');
const Store = require('./storeModel.js');

const Product = sequelize.define('Product',{
    productName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    releaseYear:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    stock:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    storeId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    sales:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    rate:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    categoryId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
});

Product.belongsTo(Store);
module.exports = Product;