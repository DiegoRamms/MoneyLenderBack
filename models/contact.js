const { Schema, model } = require("mongoose");


const ContactSchema = Schema({
    userRequest: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userPending: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userRequesAccepted: {
        type: Boolean,
        require: true,
        default: true
    },
    userPendingAccepted: {
        type: Boolean,
        require: true,
        default: false
    }
    
})

ContactSchema.methods.toJSON = function() {
    const data = {id,id} = this.toObject()
    return data
}


module.exports = model('Contact', ContactSchema)