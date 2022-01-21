const { Schema, model } = require("mongoose");


const UserTypeSchema = Schema({
    name: {
        type: String,
        require: [true,'El tipo de usuario es obligatorio']
    }
})

UserTypeSchema.methods.toJSON = function(){
    const {__v, _id, ...userType} = this.toObject()
    userType.uid = _id
    return userType
}


module.exports = model('UserType',UserTypeSchema)
