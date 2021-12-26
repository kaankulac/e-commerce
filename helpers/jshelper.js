const bcrypt  = require('bcrypt');



exports.getId = (pathname) => {
    pathname = pathname.split('/');
    var productName = pathname[2].split('-');
    var length = productName.length;
    var id = productName[length-1];
    return id
};


exports.hashElement = async (element) => {
    var salt = await bcrypt.genSalt(10);
    var hashedElement = await bcrypt.hash(element,salt);
    return hashedElement
}

exports.passwordControl = (password) => {
    var sembol = '.*|,:<>[]{}`;()@&$#%!+-"/';
    var cases = "ABCDEFGHIJKLMNOPRSTUVYZWXQ";
    var a = false;
    var b = false;
    var c = false;
    for(var i = 0; i<password.length;i++){       
         if (sembol.indexOf(password.charAt(i))!=-1){
             var a = true;
         }
         if (cases.indexOf(password.charAt(i))!=-1){
             var b = true;
         }
         if (cases.toLowerCase().indexOf(password.charAt(i))!=-1){
            var c = true;
         }
    }
    if (a && b && c){
        return true;
    }
    return false;
}

