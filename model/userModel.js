const express = require("express")
const { default: mongoose } = require("mongoose")


const userSchema = new mongoose.Schema({
    name:{
        type:"String",
        required:true
    },
    email:{
        type:"String",
        required:true,
        unique:true
    },
    password:{
        type:"String",
        required:true,
        minlength:6
    }
})

const userModel = new mongoose.model("User", userSchema)

module.exports = userModel