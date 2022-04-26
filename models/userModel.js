const mongoose=require('mongoose')
const express=require('express')

const userSchema= new mongoose.Schema({
    first_name:{
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    last_name:{
        type: String,
        required: true,
        uppercase: true
    },
    email:{
        type: String,
        required: true,
        unique: [true, "Email Already Exist"]
    },
    mobile:{
        type: String,
        required: true,
        minlength: [11, "Minimum Allowed length is 11"]
    },
    image:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        
    },
    // confirm_Password:{
    //     type: String,
    //     required: true
    // },
    
    is_admin:{
        type: Number,
        required: true
    },
    is_varified:{
        type: Number,
        default: 0
    },
    token:{
        type: String,
        default: ''
    },

    // tokens:[{
    //     token:{
    //         type: String,
    //          required: true
    //     }
    // }]

});

module.exports= mongoose.model('User', userSchema);