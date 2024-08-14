const express= require("express")
const multer =require("multer")
const router=express.Router()
const fs = require('fs');
const path = require('path');
const mongoose =require("mongoose")

const Event =require("../schema/eventSchema")

 const uploadDir = path.join(__dirname, '../uploads');
//  const uploadDir = path.join(__dirname, '../uploads');



// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // cb(null, `${Date.now()}-${file.originalname}`);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

  
//   const upload = multer({ storage: storage }) 
const upload = multer({ storage })

  module.exports = {
    upload,
    uploadDir
};