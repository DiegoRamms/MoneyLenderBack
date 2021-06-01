const { Schema, model, SchemaTypes } = require("mongoose")

const LoanSchema = Schema({
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
        type: Schema.Types.Decimal128,
        default: 0.00
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
        default: 'MONTH',
        enum: ['MONTHLY','WEEKLY','DAILY','ONCE']
    },
    interestPercent: {
        type: Schema.Types.Decimal128,
        default: 0.00
    }

})