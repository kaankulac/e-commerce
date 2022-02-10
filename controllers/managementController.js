const bodyParser = require('body-parser');
const Product = require('../models/productModel.js');
const Store = require('../models/storeModel.js');
const Image = require('../models/imageModel.js');
const Category = require('../models/categoryModel.js');
const helper = require('../helpers/jshelper.js');
const Tag = require('../models/tagModel.js');


exports.addProductGet = async (req,res) =>{
    if (helper.authentication(req.session) && req.session.type==="seller"){
        var categories = await Category.findAll();
        var categoryNames = [];
        for(var i = 0;i<categories.length;i++){
            var categoryName = categories[i].categoryName;
            categoryNames.push(categoryName);
        }
        res.render('addProduct.ejs',{
            info:false,
            message:'Please fill in all boxes.',
            isAuthenticated:req.session.isAuthenticated,
            session:req.session,
            categoryNames:categoryNames
        
        })
    }else if(helper.authentication(req.session) && req.session.type === "user"){
        res.render('404Page.ejs');
    }else{
        res.redirect('/login');
    }
}

exports.addProductPost = async (req,res) =>{
    var categories = await Category.findAll();
    var categoryNames = [];
    for(var i = 0;i<categories.length;i++){
        var categoryName = categories[i].categoryName;
        categoryNames.push(categoryName);
    }
    var count = await Product.count({where:{productName:req.body.pName,storeId:req.session.user.storeId}});
    if(count===0){
        var images = req.body.imageBox.split(',');  
        var tags = req.body.textBox.split(',');    console.log(tags);
        var category = await Category.findOne({where:{categoryName:req.body.category}});
        var categoryId = category.id;
        var product = {
            productName:req.body.pName,
            price:req.body.price,
            releaseYear:req.body.releaseYear,
            stock:req.body.stock,
            description:req.body.description,
            categoryId:categoryId,
            images:images,
            tags:tags,
        }

    
        const createProduct = await Product.create({
            productName:product.productName,
            price:product.price,
            releaseYear:product.releaseYear,
            stock:product.stock,
            description:product.description,
            storeId:req.session.user.storeId,
            categoryId:product.categoryId,
            sales:0,
    
        })
        var newProduct = await Product.findOne({where:{productName:product.productName,storeId:req.session.user.storeId}});
        var productId = newProduct.id;
        async function addImage(image){
            if(image){
                const element = await Image.create({
                    imageUrl:image,
                    productId:productId
                })
            }

        }
        async function addTag(tag){
            if(tag){
                const element = await Tag.create({
                    productId:productId,
                    tag:tag
                })
            }

        }

        product.images.forEach(addImage);
        product.tags.forEach(addTag);
        
    
        res.redirect('back');
    }else{
        console.log('ürün zaten mağazanızda listelenmiş durumda..')
        res.redirect('back');
    }

}