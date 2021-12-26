const url = require('url');
const Product = require('../models/productModel.js');
const miniSearch = require('minisearch');

exports.searchGet = async (req,res) => {
    var search = new miniSearch({
        fields:['productName'],
        storeFields:['productName','price']
    });
    var products = await Product.findAll();
    search.addAll(products);
    var pathname = url.parse(req.url).pathname;
    var pathname = pathname.split('/');
    var key = pathname[2];
    key = key.replace('?','');
    var elements = key.split('+');
    var results = [];
    for(var i = 0;i<elements.length;i++){
        var result = await search.search(elements[i]);
        for(var j = 0; j<result.length;j++){
            results.push(result[i]);
        }
    }
    res.render('searchPage.ejs',{isAuthenticated:req.session.isAuthenticated,products:results})

}