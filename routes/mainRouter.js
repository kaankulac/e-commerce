const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mainController = require('../controllers/mainController.js');
const storePageController = require('../controllers/storePageController.js');
const productPageController = require('../controllers/productPageController.js');
const searchController = require('../controllers/searchController.js');

router.use(bodyParser.urlencoded({extended:true}));

router.get('/',mainController.indexGet);
router.post('/',mainController.pFavouritePost);
router.get('/logout/',mainController.logoutGet);
router.get('/store/:storename',storePageController.storePageGet);
router.get('/products/:productname',productPageController.productPageGet);
router.get('/shopcart',mainController.shopcartPageGet);
router.post('/shopcart/:id',mainController.shopcartPagePost);
router.post('/products/:productname',productPageController.productPagePost);
router.post('/product/comment',productPageController.productCommentPost);
router.get('/product/comment',productPageController.productCommentGet);
router.get('/orders',mainController.orderPageGet);
router.get('/order/complete/:id',mainController.orderCompleteGet);
router.get('/order/cancel/:id',mainController.orderCancelGet);
router.get('/orders/cancelled',mainController.cancelledOrdersGet);
router.get('/orders/completed',mainController.completedOrdersGet);
router.post('/favourite/:id',productPageController.productFavouritePost);
router.post('/favourite/remove/:id',productPageController.productRemoveFavouritePost);
router.get('/text/:orderId',mainController.textGet);
router.post('/text/:orderId',mainController.textPost);
router.get('/favourites',mainController.favouritePageGet);
router.get('/return/:id',mainController.returnProductGet);
router.post('/return/:id',mainController.returnProductPost);
router.get('/categories',mainController.categoriesGet);
router.get('/categories/:category',mainController.pCategoriesGet);
router.post('/categories/:category',mainController.pFavouritePost);
router.get('/search/:element',searchController.searchGet);


router.all('*',(req,res)=>{
    res.render('404Page.ejs');
});





module.exports = router;