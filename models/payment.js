const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    },
    amount: Number,
    paymentDate: Date,
    paymentStatus: String,
    createdAt: {
        type: Date, 
        default: Date.now
    },
    updatedAt: {
        type: Date, 
        default: Date.now
    },
});
const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;