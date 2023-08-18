const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: String,
    description: String,
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
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
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;