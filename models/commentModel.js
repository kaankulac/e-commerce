const sequelize = require('../utility/database.js');
const Model = require('sequelize');
var DataTypes = require('sequelize/lib/data-types');

const Comment = sequelize.define('Comment',{
    userId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    productId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    comment:{
        type:DataTypes.STRING,
        allowNull:false
    },
    vote:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    storeVote:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
});

module.exports = Comment;