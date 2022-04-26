// const session = require("express-session");


// const isLogin= async(req,res,next) => {

//     try {
//         if(req.session.user_id)
        
//         {}
        
//         else{

//             res.redirect('/login');
//         }
        
//         next();
        
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const isLogout = async (req,res,next) =>{

//     try {
//         if(req.session.user_id){
//             res.redirect('/home');
//         }
//          next();

//     } catch (error) {
//         console.log(error.message)
//     }
// }

// module.exports = {
//     isLogin,
//     isLogout
// }


const jwt = require("jsonwebtoken");
const User= require("../models/userModel")

const auth= async (req,res,next) =>{

try {
      const token=req.cookies.jwt;
      const verifyuser=  jwt.verify(token, "mynameisasadshahabsoshahabuddinrelligionislam")
      console.log(verifyuser)

      const user= await User.findOne({_id:verifyuser.user_id}) 
      if(user){
      next();
      }
      else{
          res.redirect('/login')
      }
    
} catch (error) {

    console.log(error.message)
}
}
 module.exports=auth;   






// const verifyToken = (req, res, next) => {
//   const token =
//     req.body.token || req.query.token || req.headers["x-access-token"];

//   if (!token) {
//     return res.status(403).send("A token is required for authentication");
//   }
//   try {
//     const decoded = jwt.verify(token, "mynameisasadshahabsoshahabuddinrelligionislam");
//     req.user = decoded;
//   } catch (err) {
//     return res.status(401).send("Invalid Token");
//   }
//   return next();
// };

// module.exports = verifyToken;



