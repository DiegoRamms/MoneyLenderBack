const{ Schema, model} = require('mongoose')

const UserSchema = Schema({
    name: {
        type: String,
        require:[true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        require:[true, 'El correo es obligatorio'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        require:[true, 'La contraseña es obligatoria']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: 'UserType',
        require: true
    },
    code: {
        type: String,
        require:[true, 'El codigo es obligatorio'],
        unique: true
    },
    jwt: {
        type: String
    }
})


UserSchema.methods.toJSON = function(){
    const {__v, password, _id,type , ...user} = this.toObject()
    user.uid = _id
    return user
}


module.exports = model('User',UserSchema)