const express=require('express');
const admin_route=express();
// const session=require('express-session');
const config=require('../config/config');
// admin_route.use(session({secret:config.sessionSecret, resave: true, saveUninitialized: true}));

const bodyParser= require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended: true}))

const auth=require('../middleware/adminauth')
const adminController=require('../controllers/adminController');

admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');

const multer=require('multer')
const path=require('path')

admin_route.use(express.static('public'));

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



admin_route.get('/',adminController.loadLogin)
admin_route.post('/', adminController.verifyLogin);
admin_route.get('/home',auth,adminController.loadDashboard )
admin_route.get('/logout',adminController.logout)
admin_route.get('/forget',adminController.forgetLoad)
admin_route.post('/forget',adminController.forgetVerify)
admin_route.get('/forget-password',adminController.forgetPasswordLoad)
admin_route.post('/forget-password',adminController.resetPassword)
admin_route.get('/dashboard',auth ,adminController.adminDashboard)
admin_route.get('/new-user',auth ,adminController.newUserLoad);
admin_route.post('/new-user', upload.single('image') ,adminController.addUser);
admin_route.get('/edit-user',auth,adminController.editUserLoad)
admin_route.post('/edit-user',adminController.updateUsers)
admin_route.get('/delete-user',adminController.deleteUser)

    
admin_route.get('*', function(req,res){
       
    res.redirect('/admin')
});

module.exports=admin_route