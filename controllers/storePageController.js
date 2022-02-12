const bodyParser = require('body-parser');
const Seller = require('../models/sellerModel.js');
const Store = require('../models/storeModel.js');
const Product = require('../models/productModel.js');
const Image = require('../models/imageModel.js');
var url = require('url');


exports.storePageGet = async (req,res) => {
    var pathname = url.parse(req.url).pathname;
    var storeName = pathname.split('/')[2];
    var count = await Store.count({where:{pathName:storeName}});
    if(count===1){
        var images = []
        var store = await Store.findOne({where:{pathName:storeName}});
        var products = await Product.findAll({where:{storeId:store.id,isDeleted:false}});
        for(let i = 0; i<products.length;i++){
            var image = await Image.findOne({where:{productId:products[i].id}})
            images.push(image.imageUrl);
        }
        res.render("storePage.ejs",{store:store,products:products,images:images,isAuthenticated:req.session.isAuthenticated,session:req.session});
    }else{
        res.render('404Page.ejs');
    }
}