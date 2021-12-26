const Category = require('../models/categoryModel.js');



exports.categoryAddGet = (req,res) => {
    res.render('addCategory.ejs');
}

exports.categoryAddPost = async (req,res) => {
    const count = await Category.count({where:{categoryName:req.body.categoryName}});
    if(count===0){
        const category = await Category.create({
            categoryName:req.body.categoryName
        })
        res.redirect('back');
    }else{
        console.log('category already exists!');
        res.redirect('back');
    }

}