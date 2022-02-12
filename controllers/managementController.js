const bodyParser = require('body-parser');
const Product = require('../models/productModel.js');
const Store = require('../models/storeModel.js');
const Image = require('../models/imageModel.js');
const Category = require('../models/categoryModel.js');
const helper = require('../helpers/jshelper.js');
const Tag = require('../models/tagModel.js');
var url = require('url');

async function getCategories(){
    var categories = await Category.findAll();
    var categoryNames = [];
    for(var i = 0;i<categories.length;i++){
        var categoryName = categories[i].categoryName;
        categoryNames.push(categoryName);
    }
    return categoryNames;
}


addProductPost = async (req,res) =>{
    var categories = await Category.findAll();
    var categoryNames = [];
    for(var i = 0;i<categories.length;i++){
        var categoryName = categories[i].categoryName;
        categoryNames.push(categoryName);
    }
    var count = await Product.count({where:{productName:req.body.pName,storeId:req.session.user.storeId}});
    if(count===0){
        var images = req.body.imageBox.split(',');  
        var tags = req.body.textBox.split(',');
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
            isDeleted:false
    
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

deleteProductPost = async (req,res) => {
    var pathname = url.parse(req.url).pathname;
    var pathname = pathname.split('/');
    var id = pathname[4];
    Product.update({
        isDeleted:true
    },{
        returning:true,where:{id:id}
    })
    res.redirect('back');
}

exports.managementGet = async (req,res) => {
    if(helper.authentication(req.session) && req.session.type==="seller"){
            var store = await Store.findOne({where:{id:req.session.user.storeId}});
            var images = [];
            var products = await Product.findAll({where:{storeId:store.id,isDeleted:false}});
            for(let i = 0; i<products.length;i++){
                var image = await Image.findOne({where:{productId:products[i].id}});
                images.push(image.imageUrl);
            }
            res.render('management.ejs',{isAuthenticated:req.session.isAuthenticated,
                session:req.session,
                store:store,products:products,
                images:images,
                categoryNames:await getCategories(),
                info:false,
                message:'Please fill in all boxes.',


            });

    }else if(helper.authentication(req.session) && req.session.type==="user"){
            res.render('404Page.ejs');

    }else{
        res.redirect('/login');
    }}

exports.managementPost = async (req,res) => {
    var pathname = url.parse(req.url).pathname;
    pathname = pathname.split('/');
    var order = pathname[2];
    var order2 = pathname[3];
    if(order==="product"){
        if(order2==="add"){
            addProductPost(req,res);
        }else if(order2==="delete"){
            deleteProductPost(req,res);
        }
    }
}