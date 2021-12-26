const Product = require('../models/productModel.js');
const Image = require('../models/imageModel.js');
const Store = require('../models/storeModel.js');
const Shopcart = require('../models/shopcartsModel.js');
const Order = require('../models/orderModel.js');
const Seller = require('../models/sellerModel.js');
const User = require('../models/userModel.js');
const Return = require('../models/returnModel.js');
var url = require('url');
const mailer = require('nodemailer');
const Message = require('../models/messageModel.js');
const Favourite = require('../models/favouritesModel.js');
const Category = require('../models/categoryModel.js');
const paymentMethod = require('../models/paymentMethodModel.js');

url1 = (id,name) => {
    name = name.replace(' ','-')
    name = name.trim();
    return `/products/${name}-${id}` 
}

exports.indexGet = async (req,res) => {
    var images = [];
    var products = await Product.findAll();
    var length = products.length;
    var store = await Store.findAll();
    for(var i = products[0].id;i<=products[length-1].id;i++){
        var image = await Image.findOne({where:{productId:i}});
        images.push(image.imageUrl);
    }
    res.render('index.ejs',{isAuthenticated:req.session.isAuthenticated,products:products,images:images,stores:store,url:url1});
};

exports.logoutGet = (req,res) => {
    if(req.session.type){
        req.session.destroy(function(err){
            if(err){
                console.log(err)
            }else{
                res.redirect('/');
            }
        });
    }else{
        res.render('logout.ejs');
    }
};

exports.shopcartPageGet = async (req,res) => {
    var products = [];
    var shopcart = await Shopcart.findAll({where:{userId:req.session.user.id}});
    for (var i = 0;i<shopcart.length;i++){
        var product = await Product.findOne({where:{id:shopcart[i].productId}});
        products.push(product);
    }
    res.render('shopCart.ejs',{isAuthenticated:req.session.isAuthenticated,products:products,shopcart:shopcart});
};

exports.shopcartPagePost = async (req,res) => {
    var pathname = url.parse(req.url).pathname;
    var id = pathname.split('/')[2];
    var orders = [];

    if (id==="order"){
        var userId = req.session.user.id;
        if (req.session.type==="user"){
            var user = await User.findOne({where:{id:userId}});
        }else{
            var user = await Seller.findOne({where:{id:userId}});
        }
        var pMethodCount = paymentMethod.count({where:{userId:userId}}); 
        if (user.adress && pMethodCount>0){
            var products = await Shopcart.findAll({where:{userId:userId}});
            for(var i = 0; i<products.length;i++){
                var product = await Product.findOne({where:{id:products[i].productId}});
                var order = await Order.create({
                    productId:products[i].productId,
                    userId:products[i].userId,
                    storeId:product.storeId,
                    totalPrice:products[i].totalPrice,
                    isDone:false,
                    amount:products[i].amount,
                    isCancelled:false,
                    isComment:false,
                });
                var order = [product.productName,products[i].amount,products[i].totalPrice];
                orders.push(order);
    
                
    
    
                await Shopcart.destroy({where:{id:products[i].id}});
            }
            var transporter = mailer.createTransport({
                service: 'gmail',
                auth: {
                user: 'kaankulac5555@gmail.com',
                pass: '234234234k'
                }
            });
            var mailOptions = {
                from: 'kaankulac5555@gmail.com',
                to: req.session.user.email,
                subject: 'Succes',
                text: 'Ordered....'+orders
            };
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log(error);
                }else{
                    console.log("email sent: "+info.response);
                }
            })
            res.redirect('/');
        }else{
            console.log('You must add a payment method and address in order to place an order.')
            res.redirect('back');
        }
        
    }else{
        var shopcart = await Shopcart.findOne({where:{id:id}});
        var pId = shopcart.productId;
        var product = await Product.findOne({where:{id:pId}});
        Shopcart.update({
            amount:req.body[product.productName],
            totalPrice:parseInt(req.body[product.productName])*parseInt(product.price)
        },
        {
            returning:true, where: {id:id}
        }
        )
    
        res.redirect('/shopcart');
    }


}


exports.orderPageGet = async (req,res) => {
    var id = req.session.user.id
    if(req.session.type==="user"){
        var orders = await Order.findAll({where:{userId:id,isCancelled:false,isDone:false}});
        var products = [];
        for (var i = 0; i<orders.length;i++){
            var productId = orders[i].productId;
            var product = await Product.findOne({where:{id:productId}});
            products.push(product);
        }
        res.render('orderPage.ejs',{isAuthenticated:req.session.isAuthenticated,orders:orders,products:products,user:req.session.type});       
    }else{
        var seller = await Seller.findOne({where:{id:id}});
        var orders = await Order.findAll({where:{storeId:seller.storeId,isCancelled:false,isDone:false}});
        var products = [];
        for (var i = 0; i<orders.length;i++){
            var productId = orders[i].productId;
            var product = await Product.findOne({where:{id:productId}});
            products.push(product);
        }
        res.render('orderPage.ejs',{isAuthenticated:req.session.isAuthenticated,orders:orders,products:products,user:req.session.type});       

    }
}

exports.orderCompleteGet = async (req,res) => {
    var transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'kaankulac5555@gmail.com',
        pass: '234234234k'
        }
    });

    var pathname = url.parse(req.url).pathname;
    var elements = pathname.split('/');
    var id = elements[3];
    Order.update({
        isDone:true
    },
    {
        returning:true, where:{id:id}
    }
    )
    var order = await Order.findOne({where:{id:id}});
    var product = await Product.findOne({where:{id:order.productId}});
    Product.update({
        sales:product.sales+1
    },
    {
        returning:true, where:{id:product.id}
    }
    )
    var user = await User.findOne({where:{id:order.userId}});
    var mailOptions = {
        from: 'kaankulac5555@gmail.com',
        to: user.email,
        subject: 'Your order was completed',
        text: 'Your order was completed if you have a issiue localhost:8000/orders '
    };
    transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
            console.log(err);
        }else{
            console.log(info);
        }
    })
    res.redirect('back');
}

exports.orderCancelGet = async (req,res) => {
    var transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'kaankulac5555@gmail.com',
        pass: '234234234k'
        }
    });

    var pathname = url.parse(req.url).pathname;
    var elements = pathname.split('/');
    var id = elements[3];
    var order = await Order.findOne({where:{id:id}});
    var user = await User.findOne({where:{id:order.userId}});
    Order.update({
        isCancelled:true
    },
    {
        returning:true, where:{id:id}
    }
    )
    var mailOptions = {
        from: 'kaankulac5555@gmail.com',
        to: user.email,
        subject: 'Your order was completed',
        text:"The store has marked your order as complete if you have a issue please visit orders page in our website"
    };
    transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
            console.log(err);
        }else{
            console.log(info);
        }
    })
    res.redirect('back');
}


exports.cancelledOrdersGet = async (req,res) => {
    var products = [];
    if(req.session.type==="user"){
        var cancelledOrders = await Order.findAll({where:{userId:req.session.user.id,isCancelled:true}});
    }else{
        var cancelledOrders = await Order.findAll({where:{storeId:req.session.user.storeId,isCancelled:true}});
    }
    for(var i = 0; i<cancelledOrders.length;i++){
        var product = await Product.findOne({where:{id:cancelledOrders[i].productId}})
        products.push(product);
    }
    res.render('cancelledOrder.ejs',{isAuthenticated:req.session.isAuthenticated,orders:cancelledOrders,products:products});
}

exports.completedOrdersGet = async (req,res) => {
    var products = [];
    if(req.session.type==="user"){
        var completedOrders = await Order.findAll({where:{userId:req.session.user.id,isDone:true}});
    }else{
        var completedOrders = await Order.findAll({where:{storeId:req.session.user.storeId,isDone:true}});
    }
    for(var i = 0; i<completedOrders.length;i++){
        var product = Product.findOne({where:{id:completedOrders[i].productId}})
        products.push(product);
    }
    res.render('completedOrder.ejs',{isAuthenticated:req.session.isAuthenticated,orders:completedOrders,products:products})

}

exports.textGet = async (req,res) => {
    var pathname = url.parse(req.url).pathname;
    var pathname = pathname.split('/');
    var orderId = pathname[2];
    var order = await Order.findOne({where:{id:orderId}});
    var userId = order.userId;
    var storeId = order.storeId;
    var store = await Store.findOne({where:{id:storeId}});
    var user = await User.findOne({where:{id:userId}});
    var messages = await Message.findAll({where:{orderId:orderId}});
    res.render('textPage.ejs',{isAuthenticated:req.session.isAuthenticated,store:store,user:user,messages:messages});
}

exports.textPost = async (req,res) => {
    var message = req.body.message;
    var pathname = url.parse(req.url).pathname;
    var pathname = pathname.split('/');
    var orderId = pathname[2];
    var order = await Order.findOne({where:{id:orderId}});
    var storeId = order.storeId;
    var store = await Store.findOne({where:{id:storeId}});
    var userId = req.session.user.id;
    if (req.session.type==="user"){
        var message = Message.create({
            userId:userId,
            storeId:storeId,
            orderId:orderId,
            message:message,
            isAnswer:false,
        })
    }else{
        var message = Message.create({
            userId:userId,
            storeId:storeId,
            orderId:orderId,
            message:message,
            isAnswer:true,
        })
    }
 
    res.redirect('back');
}

exports.favouritePageGet = async (req,res) => {
    var userId = req.session.user.id;
    var favourites = await Favourite.findAll({where:{userId:userId}});
    var products = []
    for (var i = 0; i<favourites.length;i++){
        var product = await Product.findOne({where:{id:favourites[i].productId}});
        products.push(product);
    }
    res.render('favouritePage.ejs',{isAuthenticated:req.session.isAuthenticated,products:products})

}

exports.returnProductGet = (req,res) => {
    res.render('return.ejs',{isAuthenticated:req.session.isAuthenticated});
    
}

exports.returnProductPost = async (req,res) => {
    var pathname = url.parse(req.url).pathname;
    var pathname = pathname.split('/');
    var orderId = pathname[2];
    var order = await Order.findOne({where:{id:orderId}});
    if(order.isReturned){
        console.log('already returned...')
        res.redirect('/')
    }else{
        var returnProduct = await Return.create({
            orderId:orderId,
            cause:req.body.cause
    
        })
        Order.update({
            isReturned:true
        },
        {
            returning:true,where:{id:orderId}
        }
        )
        res.redirect('/')

    }

}

exports.categoriesGet = async (req,res) => {
    var categories = await Category.findAll();
    res.render('categories.ejs',{isAuthenticated:req.session.isAuthenticated,categories:categories});
}

exports.pCategoriesGet = async (req,res) => {
    var pathname = url.parse(req.url).pathname;
    var pathname = pathname.split('/');
    var categoryName = pathname[2];
    var stores = await Store.findAll();
    var category = await Category.findOne({where:{categoryName:categoryName}});
    var images = [];
    var products = await Product.findAll({where:{categoryId:category.id}});
    var length = products.length;
    for(var i = products[0].id;i<=products[length-1].id;i++){
        var image = await Image.findOne({where:{productId:i}});
        images.push(image.imageUrl);
    }

    res.render('pCategory.ejs',{isAuthenticated:req.session.isAuthenticated,products:products,category:category,stores:stores,images:images,url:url1});
}

exports.pFavouritePost = async (req,res) => {
    var count = await Favourite.count({where:{userId:req.session.user.id,productId:req.body.button}})
    if (count>0){
        console.log('you already added the favourite this product')
        res.redirect('back');
    }else{
        var favourite = await Favourite.create({
            userId:req.session.user.id,
            productId:req.body.button,
            isChecked:true
        });
        res.redirect('back');
    }

}