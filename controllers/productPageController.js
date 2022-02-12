const bodyParser = require('body-parser');
const Seller = require('../models/sellerModel.js');
const Store = require('../models/storeModel.js');
const User = require('../models/userModel.js');
const Product = require('../models/productModel.js');
const Image = require('../models/imageModel.js');
const helper = require('../helpers/jshelper.js');
const Shopcart = require('../models/shopcartsModel.js');
const Comment = require('../models/commentModel.js');
const Favourite = require('../models/favouritesModel.js');
var url = require('url');
var ejs = require('ejs');
const Order = require('../models/orderModel.js');


exports.productPageGet = async (req,res) => {
    var isComment = false;
    var getUser = async (userId) => {
        return new Promise((resolve,reject) => {
            resolve(31);
        }).then((userId)=>{
            var user = User.findOne({where:{id:userId}});
            return user;
        }).then(function(user) {
            var username = user.username;
            return username;
        });          
        
    }
    var pathname = url.parse(req.url).pathname;
    var id = helper.getId(pathname);

    var count = await Product.count({where:{id:id}});
    var comment = await Order.count({where:{productId:id,userId:req.session.user.id,isComment:false}});
    if (comment>0){
        var isComment = true;
    }

    var commentCount = await Comment.count({where:{productId:id}});
    var sumVote = await Comment.sum('vote', {where:{productId:id}});
    var rating = sumVote/commentCount;
    var comments = await Comment.findAll({where:{productId:id}});
    var favCount = await Favourite.count({where:{productId:id,userId:req.session.user.id}});
    var productFavCount = await Favourite.count({where:{productId:id}});
    if(favCount>0){
        var favourite = await Favourite.findOne({where:{productId:id,userId:req.session.user.id}});
        var isFavourite = favourite.isChecked;
    }else{
        var isFavourite = false;
    }

    if(count===1){
        req.session.product = id;
        var product = await Product.findOne({where:{id:id}});
        var images = await Image.findAll({where:{productId:id}});
        var users = [];
        for (var i = 0; i<comments.length;i++){
            var user = await User.findOne({where:{id:comments[i].userId}});
            username = await getUser(user.id)
            users.push(username)
        }

        res.render('productPage.ejs',{favCount:productFavCount,product:product,isAuthenticated:req.session.isAuthenticated,images:images,comments:comments,users:users,rating:rating,isFavourite:isFavourite,isComment:isComment,session:req.session});
    }else{
        res.render('404Page.ejs');
    }

};

exports.productPagePost = async (req,res) => {
    var pathname = url.parse(req.url).pathname;
    var id = helper.getId(pathname);
    var product = await Product.findOne({where:{id:id}});
    var shopcart = Shopcart.create({
        userId:req.session.user.id,
        productId:id,
        amount:1,
        totalPrice:product.price
    });
    res.redirect('/');

}


exports.productCommentGet = (req,res) => {
    res.redirect('/');
}
exports.productCommentPost = async (req,res) => {
    if(req.body.star5){
        var star = 5;
    }else if(req.body.star4){
        var star = 4;
    }else if(req.body.star3){
        var star = 3;
    }else if(req.body.star2){
        var star = 2;
    }else if(req.body.star1){
        var star = 1;
    }else{
        var star = 0;
    }
    if(req.body.star5s){
        var storeStar = 5;
    }else if(req.body.star4s){
        var storeStar = 4;
    }else if(req.body.star3s){
        var storeStar = 3;
    }else if(req.body.star2s){
        var storeStar = 2;
    }else if(req.body.star1s){
        var storeStar = 1;
    }else{
        var storeStar = 0
    }
    var id = req.session.user.id
    var productId = req.session.product
    if(star && storeStar){
        const comment = await Comment.create({
            userId:id,
            comment:req.body.comment,
            productId:productId,
            vote:star,
            storeVote:storeStar
        });
        res.redirect('/');
        var productRate = await Comment.sum('vote',{where:{productId:productId}});
        var productCount = await Comment.count({where:{productId:productId}});
        var productRating = productRate/productCount;
        var order = await Order.findOne({where:{productId:productId,userId:id,isComment:false}});
        Order.update({
            isComment:true
        },{
            returning:true, where:{id:order.id}
        }
        )
        Product.update({
            rate:productRating
        },
        {
            returning:true, where:{id:productId}
        }
        )
        var product = await Product.findOne({where:{id:productId}});
        var storeId = product.storeId;
        
        var storeProducts = await Product.findAll({where:{storeId:storeId}});
        var storeCount = 0;
        var storeRate  = 0;
        for(var i = 0; i<storeProducts.length;i++){
            var sRate = await Comment.sum('storeVote',{where:{productId:storeProducts[i].id}});
            var pCount = await Comment.count({where:{productId:storeProducts[i].id}});
            storeCount+=pCount;
            storeRate+=sRate;
        }
        var storeRating = storeRate/storeCount;
        Store.update({
            rating:storeRating
        },
        {
            returning:true, where:{id:storeId}
        })

    }else{
        var pathname = url.parse(req.url).pathname;
        console.log('You have to vote to comment.')
        res.redirect('back');
    }

}


exports.productFavouritePost = async (req,res) => {
    var pathname = url.parse(req.url).pathname;
    var id = pathname.split('/')[2];
    var favourite = await Favourite.create({
        userId:req.session.user.id,
        productId:id,
        isChecked:true,
    });
    res.redirect('back');
}

exports.productRemoveFavouritePost = async (req,res) => {
    var pathname = url.parse(req.url).pathname;
    var id = pathname.split('/')[3];
    Favourite.destroy({where:{userId:req.session.user.id,productId:id}});
    res.redirect('back');
}

