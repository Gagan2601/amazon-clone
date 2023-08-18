const {validateEmail} = require("../validations/common");
const mongoose = require("mongoose");
const addressSchema  = require("./address");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: validateEmail,
    },
    password: {
        type: String,
        required: true,
    },
    address: addressSchema,
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    createdAt: {
        type: Date, 
        default: Date.now
    },
    updatedAt: {
        type: Date, 
        default: Date.now
    },
});
const User = mongoose.model("User", userSchema);
module.exports = User;