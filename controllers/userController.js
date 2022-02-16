const bodyParser = require('body-parser');
const User = require('../models/userModel.js');
const Seller = require('../models/sellerModel.js');
const Store = require('../models/storeModel.js');
const Product = require('../models/productModel.js');
const Image = require('../models/imageModel.js');
const paymentMethod = require('../models/paymentMethodModel.js');
const bcrypt  = require('bcrypt');
const mailer = require('nodemailer');
const emailExistance = require('email-existence');
const helper = require('../helpers/jshelper.js');
const { requires } = require('consolidate');


exports.userRegisterGet = (req,res) => {
    res.render('userRegister.ejs',{message:'Please fill in all boxes'});
}

exports.userRegisterPost = async (req,res) =>{
        var transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
            user: 'kaankulac5555@gmail.com',
            pass: '234234234k'
            }
        });
        
        var mailOptions = {
            from: 'kaankulac5555@gmail.com',
            to: req.body.email,
            subject: 'Succes',
            text: 'Account created!'
        };

            if(helper.emailAuthenticator(req.body.email)){
                if(req.body.account=='personal'){
                    var count = await User.count({where:{username:req.body.username}});
                    var sellerCount = await Seller.count({where:{username:req.body.username}});
                    var hashedPassword = await helper.hashElement(req.body.password);
                    var mail = await Seller.count({where:{email:req.body.email}});
                    var userMail = await User.count({where:{email:req.body.email}});
                    if (count === 0 && sellerCount === 0 && mail === 0 && userMail === 0){
                        if (helper.passwordControl(req.body.password)){
                            const user = await User.create({
                                username:req.body.username,
                                password:hashedPassword,
                                email:req.body.email,
                                fullName:req.body.name,
                                adress:req.body.adress
                            });
                
                            res.redirect('/login');
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                  console.log(error);
                                } else {
                                  console.log('Email sent: ' + info.response);
                                }
                              });
                        }else{
                            res.render('userRegister.ejs',{message:'Error'});
                        }
        
                    }else{
                        res.render('userRegister.ejs',{message:'Error! username or email already exists'});
                    }
                    
                }else{
                    var count = await Seller.count({where:{username:req.body.username}});
                    var userCount = await User.count({where:{username:req.body.username}});
                    var mail = await Seller.count({where:{email:req.body.email}});
                    var userMail = await User.count({where:{email:req.body.email}});
                    if (count===0 && userCount === 0 && mail === 0 && userMail === 0){
                        if (helper.passwordControl(req.body.password)){
                             var hashedPassword = await helper.hashElement(req.body.password);

                            if(req.body.store=='create'){
                                var pathname = req.body.storeName.replace(" ","");
                                var pathName = pathname.toLowerCase();
                                const store = await Store.create({
                                    storeName:req.body.storeName,
                                    joinID:req.body.joinID,
                                    pathName:pathName
                                });
                                var sellerStore = await Store.findOne({where:{joinID:req.body.joinID}});
                                const seller = await Seller.create({
                                    username:req.body.username,
                                    password:hashedPassword,
                                    storeId:sellerStore.id,
                                    email:req.body.email
                                });
                                res.render('userRegister.ejs',{message:'Succes'})
                            }else{
                                var sellerStore = await Store.findOne({where:{joinID:req.body.joinid}});
                                const seller = await Seller.create({
                                    username:req.body.username,
                                    password:hashedPassword,
                                    storeId:sellerStore.id,
                                    email:req.body.email
                                });
                                res.redirect('/login');
            
                        }
                    }
                    }else{
                        res.render('userRegister.ejs',{message:'Error! username or email already exist!'});
                    }
                    }
            }else{
                console.log('email does not exists!')
                res.render('userRegister.ejs',{message:'Email does not exists!'});
            }

        
 
        
}

exports.userLoginGet = (req,res) => {
    res.render('login.ejs',{message:""});
}

exports.userLoginPost = async (req,res) => {
    var type = req.body.user;
    var username = req.body.username;
    var password = req.body.password;
    if (type==="personal"){
        var count = await User.count({where:{username:username}});
        if (count>0){
            var user = await User.findOne({where:{username:username}});
            var validPassword = await bcrypt.compare(password,user.password);
            if(validPassword){
                req.session.isAuthenticated = true;
                req.session.user = user;
                req.session.type = "user";
                console.log('giriş başarılı ana sayfaya yönlendiriliyorsunuz...');
                res.redirect('/');
            }else{
                console.log('şifre yanlış...');
                res.redirect('/login');
            }
        }else{
            res.redirect('/login');
            console.log('kullanıcı bulunamadı...')
        }
    }else{
        var count = await Seller.count({where:{username:username}});
        if (count>0){
            var seller = await Seller.findOne({where:{username:username}});
            var validPassword = await bcrypt.compare(password,seller.password);
            if (validPassword){
                req.session.isAuthenticated = true;
                req.session.user = seller;
                req.session.type = "seller";
                res.redirect('/');
                console.log('giriş başarılı ana sayafaya yönlendiriliyorsunuz...');
            }else {
                res.redirect('/login');
                console.log('şifre yanlış..');
            }
        }else{
            console.log('Satıcı bulunamadı...');
            res.redirect('/login');
        }
    }
}



exports.passwordChangePost = async (req,res) => {
    var validPassword = await bcrypt.compare(req.body.password,req.session.user.password);
    if(validPassword){
        if (req.body.newPassword === req.body.reNewPassword){
            var hashedPassword = await helper.hashElement(req.body.newPassword); 
            var id = req.session.user.id;
            if(req.session.type == "user"){
                var user = await User.findOne({where:{id:id}});
                User.update({
                    password:hashedPassword
                },
                {
                    returning:true, where: {id:id}
                }
                )
                req.session.user.password = hashedPassword;              
    
            }else{
                Seller.update({
                    password:hashedPassword
                },{
                    returning:true,where: {id:id}
                })
                req.session.user.password = hashedPassword;
            }
        }else{
            console.log("Yeni şifreleriniz uyuşmuyor.")
        }
    }else{
        console.log("Güncel şifrenizi yanlış girdiniz.")
    }
    res.redirect('back');


}

exports.profilePageGet = async (req,res) => {
    if(req.session.type==="user"){
        var user = await User.findOne({where:{id:req.session.user.id}});
        var pMethodCount = await paymentMethod.count({where:{userId:req.session.user.id}});
        if (pMethodCount>0){
            var pMethod = await paymentMethod.findOne( {where:{userId:req.session.user.id}});

        }else{
            var pMethod = false;
        }
    }else{
        if (pMethodCount>0){
            var pMethod = await paymentMethod.findOne( {where:{userId:req.session.user.id,isSeller:true}});

        }else{
            var pMethod = false;
        }
        var user = await Seller.findOne({where:{id:req.session.user.id}});
    }
    res.render('profilePage.ejs',{session:req.session,isAuthenticated:req.session.isAuthenticated,user:user,type:req.session.type,pMethod:pMethod});
}


exports.changeAdressPost = async (req,res) => {
    if (req.session.type === "user"){
        if(req.param('action')==="add"){
            User.update(
                {
                    adress:req.body.adress
                },
                {
                    returning:true,where:{id:req.session.user.id}
                }
                )
        }else if(req.param('action')==="delete"){
            User.update(
                {
                    adress:null
                },
                {
                    returning:true,where:{id:req.session.user.id}
                }
                )
        }else if(req.param('action')==="edit"){
            User.update(
                {
                    adress:req.body.adressInput
                },
                {
                    returning:true,where:{id:req.session.user.id}
                }
                )
            }

}
res.redirect('back')
}

exports.changeEmailGet = (req,res) => {
    res.render('changeEmail.ejs',{isAuthenticated:req.session.isAuthenticated,session:req.session,});
}

exports.changeEmailPost = async (req,res) => {
    emailExistance.check(req.body.email, async (err,result) => {
        if(result){
            if(req.session.type="user"){
                User.update({
                    email:req.body.email
                },
                {
                    returning:true,where:{id:req.session.user.id}
                }
                )
            }else{
                Seller.update({
                    email:req.body.email
                },
                {
                    returning:true,where:{id:req.session.user.id}
                }
                )
    
            }
            res.redirect('/profile');

        }else{
            console.log('email does not exists!!')
            res.redirect('back');
        }

    
    })

    }

exports.addPaymentMethodGet = (req,res) => {
    res.render('changePaymentMethod.ejs',{isAuthenticated:req.session.isAuthenticated,session:req.session})
}

exports.addPaymentMethodPost = async (req,res) => {
    var eDate = req.body.month+"/"+req.body.year;
    if(req.session.type==="user"){
        var isSeller = false;
    }else{
        var isSeller = true;
    }
    var pMethod = await paymentMethod.create({
        cardNumber:req.body.cardNumber,
        cvv:req.body.cvv,
        expritionDate:eDate,
        userId:req.session.user.id,
        isSeller:isSeller
    })

    res.redirect('/profile');
}
    


exports.deletePaymentMethodPost = async (req,res) => {
    if(req.session.type==="user"){
        var isSeller = false;
    }else{
        var isSeller = true;
    }
    await paymentMethod.destroy({where:{userId:req.session.user.id,isSeller:isSeller}});
    res.redirect('/profile');
}