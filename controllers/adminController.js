const User=require('../models/userModel');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const express=require('express');
const app=express();
const cookieParser=require('cookie-parser')
const auth=require('../middleware/auth') 
app.use(cookieParser())
// const randormString = require('randomstring');
const randomstring = require('randomstring');
const nodemailer=require('nodemailer');


//  Hasing Password

const securePassword= async (password) =>{
    try{
         const passwordHash= await bcrypt.hash(password,10);
         return passwordHash;
    }
    catch (error){
      console.log(error.message)
    }
  }
  



    // Sending Mail for Admin Reset password

const sendResetpasswordMail = async (name,email,token)=>{
// try { 
        
      const transporter= nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:587,
      secure: false,
      requireTLS: true,
      auth:{
        user:'itsasadshahab@gmail.com',
        pass: 'ulleyabawsnmrwbl'
      }
    })
    
    
    const mailOptions={
      from:'itsasadshahab@gmail.com',
      to:email,
      subject:'For Admin  Reset Password',
      html:'<p> Hi , Please Click Here to <a href="http://localhost:3000/admin/forget-password?token='+token+'"> Reset </a> your Password.</p>  '
  }

  transporter.sendMail(mailOptions, (error,info) =>{
  
    if(error){
    
        console.log('error',error.message);
    }
    else{
  
        console.log("Email has been send:-", info.response);
    }
  })
  
      
    // } catch (error) {
    //   console.log(error.log);
      
    // }
  }




const loadLogin=async(req,res) =>{
    try {
    
        res.render('login');
    } 
    catch (error) {
        console.log(error.message);
    }
}

const verifyLogin= async (req,res) =>{
    try {
        const email=req.body.email;
        const password=req.body.password;
        const userData= await User.findOne({email:email})
        if (userData) {
            
            const passwordMatch= await bcrypt.compare(password,userData.password)

            if (passwordMatch) {

                if(userData.is_admin ==0){
                    res.render('login',{message:'User is Not Admin'})
                }
                else{
                   

                    // Jwt Token in login
        const token= jwt.sign({user_id:userData._id}, "mynameisasadshahabsoshahabuddinrelligionislam",
        {expiresIn:'5d'});
       
        res.cookie('jwt',token, {
          httpOnly:true,
         
        })

                    res.redirect("/admin/home")
                }
            }
             else {
                res.render('login',{message:'Password is Incorrect'})
            }

        } 
        else {
            res.render('login',{message:'Email is Incorrect'})
        }
        
    }  
    catch (error) {
        console.log(error.message)
    }
}

const loadDashboard=async (req,res) =>{

    try {


        const token=req.cookies.jwt;
        const verifyuser=  jwt.verify(token, "mynameisasadshahabsoshahabuddinrelligionislam")
        const userData= await User.findById({_id:verifyuser.user_id }); 
        res.render('home', { admin:userData });

        res.render('home')
        
    } 
    catch (error) {
          console.log(error.message)    
    }
};


const logout= async (req,res) =>{

    try {

        
            res.clearCookie("jwt");
        console.log('Logout Succesfully')
           res.redirect('/admin')

        }
        //  req.logout();
        //  res.redirect('/admin')
     catch (error) {
        console.log(error.message)
    }
}

const forgetLoad= async (req,res) =>{
    res.render('forget')
}

const forgetVerify= async (req,res) =>{
    try {
        
        const email=req.body.email;
        const userData= await User.findOne({email:email});
        
        if(userData){
        if(userData.is_admin === 0){
            res.render('forget', {message:'Email is Not exist as a admin'})

        }
        else{
               const randormString= randomstring.generate();
               const Updateddata = await User.updateOne({email:email},{$set:{token:randormString}});
               console.log(randormString)
               sendResetpasswordMail(userData.name,userData.email,randormString)
               res.render('forget', {message:" Please Check you Email for reset email "})
        }
    }
        else{
            res.render('forget',{message:'E-mail is incorrect'})
        }

    } catch (error) {

        console.log(error.message)
    }
}


const forgetPasswordLoad= async (req,res) =>{
    
    try {
          const token= req.query.token;
          const tokenData= await User.findOne({token:token}) 
          if(tokenData){
              res.render('forget-password',{user_id:tokenData._id})

          }
          else{
              res.render('404', {message:'invalid Token'});
          }

    } catch (error) {
        console.log(error.message)
    }

}
const resetPassword= async (req,res) =>{

    const password= req.body.password;
    const user_id= req.body.user_id;
    
    const securePass= await securePassword(password);
    const updateData= await User.findByIdAndUpdate({_id:user_id}, {$set:{password:securePass, token:''}})
    res.redirect('/admin')  
}


   // Sending Mail for new User confirmation

   const addUserMail = async (first_name,email,password, user_id)=>{
  
            
          const transporter= nodemailer.createTransport({
          host:'smtp.gmail.com',
          port:587,
          secure: false,
          requireTLS: true,
          auth:{
            user:'itsasadshahab@gmail.com',
            pass: 'ulleyabawsnmrwbl'
          }
        })
        
        
        const mailOptions={
          from:'itsasadshahab@gmail.com',
          to:email,
          subject:'Admin Add You as A new User',
          html:'<p> Hi , Please Click Here to <a href="http://localhost:3000/verify?id='+user_id+'"> Verify </a> your Mail.</p> <br> <b>E-maail: </b> '+email+' <br> <b> password:</b> '+password+'   '
      }
    
      transporter.sendMail(mailOptions, (error,info) =>{
      
        if(error){
        
            console.log('error',error.message);
        }
        else{
      
            console.log("Email has been send:-", info.response);
        }
      })
    
      }
    


const adminDashboard= async (req,res) =>{

        const userdata=  await User.find({is_admin:0});
        res.render('dashboard', {users:userdata});
}

const newUserLoad= async (req,res) =>{

    res.render('new-user');
}

const addUser=  async (req,res) =>{

    const first_name=req.body.firstname;
    const last_name=req.body.lastname;
    const email=req.body.email;
    const mno= req.body.mno;
    const image=req.file.filename;
    const password= randomstring.generate(8);
    const spassword= await securePassword(password)

        const user= new User({
            first_name:first_name,
            last_name:last_name,
            email:email,
            mobile:mno,
            image:image,
            password:spassword,
            is_admin: 0

        });
                const userData= await user.save();
                if(userData){
                    addUserMail(first_name,email,password,userData._id)
                    res.redirect('/admin/dashboard')

                }
                else{
                    res.render('new-user', {message:"Something is wrong"})
                }


}


const editUserLoad= async (req,res) =>{

    const id= req.query.id;
    const userData= await User.findById({_id:id})
    if (userData) {

         res.render('edit-user', { user:userData })

    } else {

        res.redirect('/admin/dashboard')
    }
   
}

const updateUsers= async (req,res) =>{
    const id= req.query.id
    const user_id= req.body.user_id
    console.log(user_id,'user_id')
    console.log(id,"id for update")
    const Updateddata= await User.findByIdAndUpdate({_id:id },{$set:{first_name:req.body.firstname, last_name:req.body.lastname, email:req.body.email, mobile:req.body.mno }})
    console.log(Updateddata,'updated users')
    res.redirect('/admin/dashboard')
}


const deleteUser= async(req,res) =>{
    const id=req.query.id
    await User.deleteOne({_id:id})
    res.redirect('/admin/dashboard')
    
}

module.exports={
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser
}