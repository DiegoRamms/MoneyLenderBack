const { Schema, model, SchemaTypes } = require("mongoose")

const LoanSchema = Schema({
    contactId: {
        type: Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    },
    userMoneyLender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userBorrower: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: String,
        default: "0.00"
    },
    dateStart: {
        type: Date,
        default: Date.now
    },
    dateLimit: {
        type: Date,
        default: Date.now
    },
    paymentsTime: {
        type: String,
        require: true,
        default: 'MONTHLY',
        enum: ['YEARLY','MONTHLY','WEEKLY','FORTNIGHTLY','DAILY','ONCE']
    },
    interestTime: {
        type: String,
        require: true,
        default: 'YEARLY',
        enum: ['YEARLY','MONTHLY','WEEKLY','FORTNIGHTLY','DAILY','ONCE']
    },
    interestPercent: {
        type: String,
        default: "0.00"
    },
    status: {
        type: String,
        require: true,
        default: 'PENDING',
        enum: ['PENDING','IN_PROGRESS','FINALIZED']
    },
    comment: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: 'SIMPLE',
        enum: ['COMPOUND','SIMPLE']
    }

})

LoanSchema.methods.toJSON = function() {
    const {...loan} = this.toObject()
    
    return loan
}



module.exports = model('Loan',LoanSchema)