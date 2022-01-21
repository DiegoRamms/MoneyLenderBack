const { Schema, model } = require("mongoose");

const PaymentSchema = Schema({
    loanId: {
        type: Schema.Types.ObjectId,
        ref: 'Loan',
        required: true
    },
    amount: {
        type: String,
        default: "0.00"
    },
    date: {
        type: Date,
        default: Date.now
    },
    isAccepted:{
        type: Boolean,
        default: false
    }
})

PaymentSchema.methods.toJSON = function() {
    const {...payment} = this.toObject()
    
    return payment
}



module.exports = model('Payment',PaymentSchema)