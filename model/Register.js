const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
    Id: { type: Number, required: true, unique: true },
    userid : {type : String , required : true},
    Name: { type: String, required: true, trim: true },
    Role: { type: String, enum: ["User"] , default : "User"},
    Contact: { type: Number, required: true, trim: true },
    Email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    Password: { type: String, required: true }, // Fixed the spelling
    


}, { timestamps: true });



const RegisterModel = mongoose.model("SOLARPREDICTIONUSER", RegisterSchema);

module.exports = RegisterModel;