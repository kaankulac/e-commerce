const bodyParser = require('body-parser');
const Product = require('../models/productModel.js');
const Store = require('../models/storeModel.js');
const Image = require('../models/imageModel.js');
const Category = require('../models/categoryModel.js');




exports.addProductGet = async (req,res) =>{
    var categories = await Category.findAll();
    var categoryNames = [];
    for(var i = 0;i<categories.length;i++){
        var categoryName = categories[i].categoryName;
        categoryNames.push(categoryName);
    }
    res.render('addProduct.ejs',{
        message:'Please fill in all boxes.',
        isAuthenticated:req.session.isAuthenticated,
        session:req.session,
        categoryNames:categoryNames
    
    })
}

exports.addProductPost = async (req,res) =>{
    var categories = await Category.findAll();
    var categoryNames = [];
    for(var i = 0;i<categories.length;i++){
        var categoryName = categories[i].categoryName;
        categoryNames.push(categoryName);
    }
    var category = await Category.findOne({where:{categoryName:req.body.categories}});
    var categoryId = category.id;
    var count = await Product.count({where:{productName:req.body.pname,storeId:req.session.user.storeId}});
    if (count===0){

        const product = await Product.create({
            productName:req.body.pname,
            price:req.body.price,
            releaseYear:req.body.year,
            stock:req.body.stock,
            description:req.body.desc,
            storeId:req.session.user.storeId,
            sales:0,
            categoryId:categoryId
        })
        var p = await Product.findOne({where:{productName:req.body.pname,storeId:req.session.user.storeId}});
        var productId = p.id;
        async function addImage(image) {
            const element = await Image.create({
                productId:productId,
                imageUrl:image
            })
        }
        var allImages = req.body.images.split(',');
        allImages.forEach(addImage);

        res.render('addProduct.ejs',{message:'Added..!',isAuthenticated:req.session.isAuthenticated,session:req.session,categoryNames:categoryNames})


    }else{
        res.render('addProduct.ejs',{message:'Error! Product already exists...',isAuthenticated:req.session.isAuthenticated,session:req.session,categoryNames:categoryNames});
    }
}