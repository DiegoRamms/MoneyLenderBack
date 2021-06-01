const { Schema, model } = require("mongoose");


const ContactSchema = Schema({
    userMoneyLender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userBorrower: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    
})

ContactSchema.methods.toJSON = function() {
    const {__v, ...data } = this.toObject()
    return data
}


module.exports = model('Contact', ContactSchema)