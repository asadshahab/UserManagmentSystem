const express=require('express');
const user_route=express();
const bodyParser=require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))
const cookieParser=require('cookie-parser')
user_route.use(cookieParser())

const auth=require('../middleware/auth')
const jwt=require('jsonwebtoken')

const multer=require('multer')
const path=require('path')

user_route.use(express.static('public'));

const storage= multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname, '../public/userimages'));
    },
    filename:function(req,file,cb){
        const name =Date.now()+'-'+file.originalname;
        cb(null,name)
    }
});
const upload= multer({storage:storage});

const userController=require('../controllers/userController');
const { markAsUntransferable } = require('worker_threads');

user_route.set('view engine', 'ejs');
user_route.set('views', './views/users')

user_route.get('/register',userController.loadRegister)
user_route.post('/register', upload.single('image'), userController.insertUser)
user_route.get('/verify', userController.verifyMail)
user_route.get('/login',userController.loginLoad)
user_route.post('/login',userController.verifyLogin)
user_route.get('/home',auth,userController.loadHome)

user_route.get('/logout',auth,userController.userLogout)
user_route.get('/forget', userController.forgetLoad)
user_route.post('/forget', userController.forgetVerify)
user_route.get('/forget-password', userController.forgetPasswordLoad)
user_route.post('/forget-password', userController.resetPassword)
user_route.get('/404', auth, userController.forgetPasswordLoad)
user_route.get('/verification',auth, userController.verificationLoad)
user_route.post('/verification', userController.sendVerificationLink)
user_route.get('/edit', userController.editLoad)
user_route.post('/edit',upload.single('image'),userController.updateProfile)


module.exports= user_route;