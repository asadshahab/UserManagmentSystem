const User=require('../models/userModel');
const bcrypt=require('bcrypt')
const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken')
const express=require('express');
const app=express();
const cookieParser=require('cookie-parser')
const auth=require('../middleware/auth') 
app.use(cookieParser())

const reandormstring= require('randomstring');
const { unsubscribe } = require('../routes/userRoute');
const { cookie } = require('express/lib/response');

// For sending mail
 
const sendVerifyMail = async (firstname,email,user_id)=>{
  try { 
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
    subject:'For mail Verification ',
    html:'<p> Hi '+firstname+', Please Click Here to <a href="http://localhost:3000/verify?id='+user_id+'"> Varify </a> your Password.</p>  '
}
transporter.sendMail(mailOptions,function(error,info){
  if(error){
  
      console.log(error.message);
  }
  else{

      console.log("Email has been send:-", info.response);
  }
})

    
  } catch (error) {
    console.log(error.log);
    
  }
}



const securePassword= async (password) =>{
  try{
       const passwordHash= await bcrypt.hash(password,10);
       return passwordHash;
  }
  catch (error){
    console.log(error.message)
  }
}



// for sending Mail for Reset Password


const sendResetpasswordMail = async (name,email,token)=>{
  try { 
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
    subject:'For Reset Password',
    html:'<p> Hi , Please Click Here to <a href="http://localhost:3000/forget-password?token='+token+'"> Reset </a> your Password.</p>  '
}
transporter.sendMail(mailOptions,function(error,info){
  if(error){
  
      console.log(error.message);
  }
  else{

      console.log("Email has been send:-", info.response);
  }
})

    
  } catch (error) {
    console.log(error.log);
    
  }
}


// registration 

const loadRegister= async(req,res) =>{
    try{
          res.render('registration')
    }
    catch(error){
      console.log(error.message);
    }
}

const insertUser= async (req,res) =>{
  try{

    const password=req.body.password;
    const confirm_Password=req.body.confirmpassword;
    const email=req.body.email
    const mobile=req.body.mno
    const userData= await User.findOne({email:email})
    if(userData){
      return res.render('registration', {message:'Email Already Exist'})
    }
    
    // if(email !== userData) {
      
    //   console.log('start creating user')

      if(password == confirm_Password && password.length >5){
         
        // if(mobile.length< 11)
        // {
        //   res.render('registration', {message:'Num min character is 11'})

        // }
        // else{

        // }
      
      
      const spassword= await securePassword(password);
    const user = new User({
      first_name:req.body.firstname,
      last_name:req.body.lastname,
      email:req.body.email,
      mobile:req.body.mno,
      image:req.file.filename,
      confirm_Password:req.body.confirmpassword,
      password:spassword,
      is_admin:0,
      
    });          
    // const userData= 
    await user.save()
     const save_user= await User.findOne({email:email})
    
                                                         // if (userData){
      //   Genrate JWT Token
      const token= jwt.sign({user_id:save_user._id}, "mynameisasadshahabsoshahabuddinrelligionislam",
      {expiresIn:'5d'});

    //  store token in cookies
      res.cookie('jwt',token, {
        httpOnly:true,

      })
      console.log(cookie)


      // const updatedData= await User.updateOne({email:email},{$set:{tokens:token }})
        // this.tokens = this.tokens.concat({token:token})
        // await this.save

      console.log('user Register succesfully')
      sendVerifyMail(req.body.name,req.body.email, save_user._id)  
      console.log(token)
      res.render('registration', {message:"Your Rigistration has Been Succesfull"})
    
    // }
    // else{
    //   res.render('registration', {message:"Your Rigistration has Been Failed"})
    // }
  }

  else{
    res.render('registration', {message:"password not Match or min 5 character"})

  }
    
  }
    
  catch (error){
  
       console.log(error.message)
  }
}


const verifyMail=  async(req,res) =>{
  try {
  const updateinfo = await  User.updateOne({_id:req.query.id},{$set:{is_varified:1} })
  console.log(updateinfo)
  res.render('email-verified');

  } catch (error) {
    console.log(error.message)
  }
}



// User login handller

const loginLoad= async(req,res) =>{
  try {
    
    res.render('login')

  } catch (error) {
    console.log(error.message)
    
  }
}

const verifyLogin= async(req,res) =>{

  try {
    const email= req.body.email;
    const password= req.body.password;
    
   const userData= await User.findOne({email:email})
  
   if (userData) {
    const passswordMatch= await bcrypt.compare(password,userData.password);
    
    if (passswordMatch) {
        
      if (userData.is_varified ===0) {

         res.render('login', {message:'please verified your email'})
        
      } 
      else {
        
        // Jwt Token in login
        const token= jwt.sign({user_id:userData._id}, "mynameisasadshahabsoshahabuddinrelligionislam",
        {expiresIn:'5d'});
        // console.log(token)
        // store token in cookie
        res.cookie('jwt',token, {
          httpOnly:true,
         
        })
        
        // const userData._id =req.cookies.user_id 

        // res.send({"status:":"Success", "token:":token})
        // res.header('x-auth-token', token)
        res.redirect('/home')
      }
      
    }
     else {

      res.render('login',{message:'Password is Incorrect'})
    }
     
   } 

   else {
     res.render('login',{message:'Email and Password is Incorrect'})
   }


  } catch (error) {
    console.log(error.message)
  }


}


const loadHome=async (req,res) =>{
  try {
        //  show User Profile  
    const token=req.cookies.jwt;
    const verifyuser=  jwt.verify(token, "mynameisasadshahabsoshahabuddinrelligionislam")
    const userData= await User.findOne({_id:verifyuser.user_id }); 
    res.render('home', { user:userData }); //{ user:userData }

  } catch (error) {
    console.log(error.message)
  }
}

const userLogout= async(req,res) =>{
  
      try {
        
        res.clearCookie("jwt");
        console.log('Logout Succesfully')
           res.redirect('/login')

      } catch (error) {
        console.log(error.message);
      }


}

// Forget Password code Start

const forgetLoad= async (req,res)=>{
      
       try {
             res.render('forget');
       } 
       catch (error) {
               
            console.log(error.message)
       }

}

const forgetVerify = async (req,res) =>{
     
  try {
    const email = req.body.email
    const userData= await User.findOne({email:email});
    if(userData){
     
      if(userData.is_varified === 0){
        
            res.render('forget', {message:'Email is not verified'})
      }
      else{
        const rendomstring= reandormstring.generate();
        const updatedData= await User.updateOne({email:email},{$set:{token:rendomstring }})
        sendResetpasswordMail(userData.name,userData.email, rendomstring)
        res.render('forget', {message: 'Please Check Your Email for Reset Password'})

      }

    }
    
else{
  console.log('Email did not found')
  res.render('forget', {message:'User Email is Incorrect.'})
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
          res.render('forget-password', {user_id:tokenData._id});


         }
         else{
           res.render('404', {message:'token is Invalid'})
         }


        
       } catch (error) {
         console.log(error.message)
       }

}


const resetPassword= async(req,res) =>{
try{
  const passwordd=req.body.password;
  const user_id=req.body.user_id;
  
  const secure_password= await securePassword(passwordd)

 const updateData= await User.findByIdAndUpdate({_id:user_id},{$set:{ password:secure_password,token:''}});
 console.log(updateData) 
 res.redirect('/login')
}
catch(error){
  console.log(error.message)
}

}



// for Verification  send email


 const verificationLoad= async (req,res) =>{
   try {
      res.render('verification')
   } catch (error) {
     
    console.log(error.message)
   }
 }

 const sendVerificationLink= async (req,res) =>{
   try {

    const email=req.body.email;
    const userData= await User.findOne({email:email})
    if(userData){

      sendVerifyMail(userData.name,userData.email, userData._id)
      res.render('verification', {message:'Verification Email link is send  '})
    }
    else{
      res.render('verification', {message:'E-mail is Invalid '})
    }
     
   } catch (error) {
      console.log(error.message)
   }

 }

//  Edit User Hanling 

const editLoad= async (req,res) =>{

  try {
    const id = req.query.id;
    
    const userData= await User.findById({_id:id});
    if(userData){
      res.render('edit',{user:userData});

    }
    else{
      res.redirect('/home')
    }

    
  } 
  catch (error) {
   console.log(error.message); 
  }
}

const updateProfile=async (req,res) =>{

   try {

    if (req.file) {
      
      const userData= await User.findByIdAndUpdate({_id:req.body.user_id },{$set:{first_name:req.body.firstname, last_name:req.body.lastname, email:req.body.email, mobile:req.body.mno, image:req.file.filename,  }} )

    } else {
        const userData= await User.findByIdAndUpdate({_id:req.body.user_id },{$set:{first_name:req.body.firstname, last_name:req.body.lastname, email:req.body.email, mobile:req.body.mno }} )
    }
    res.redirect('/home')
     
   } 
   
   catch (error) {
     console.log(error.log)
   }
}


module.exports={
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    verificationLoad,
    sendVerificationLink,
    editLoad,
    updateProfile,
}