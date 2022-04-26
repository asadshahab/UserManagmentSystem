


     
const jwt = require("jsonwebtoken");
const User= require("../models/userModel")

const auth= async (req,res,next) =>{

try {
      const token=req.cookies.jwt;
      const verifyuser=  jwt.verify(token, "mynameisasadshahabsoshahabuddinrelligionislam")
      console.log(verifyuser)

      const user= await User.findOne({_id:verifyuser.user_id}) 
    //   console.log('User data from auth', user)
    if(user){
      next();
    }
    else{
      res.redirect('/admin')
    }
} catch (error) {

    console.log(error.message)
}
}
 module.exports=auth;   











// const islogin= async (req,res,next) =>{
//     try {
//         if(req.session.user_id){

//         }
//            else{
//                res.redirect('/admin')
//            }
//            next();

//     } catch (error) {
//         console.log(error.message)
//     }

// }



// const islogout= async (req,res,next) => {
       
//      try {
//          if(req.session.user_id){
//              res.redirect('/admin/home')
//          }
//             next();

//      } catch (error) {
//          console.log(error.message)
//      }
// }



// module.exports={
//     islogin,
//     islogout
// }