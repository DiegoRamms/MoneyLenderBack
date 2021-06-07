const User = require("../models/user")
const UserType = require("../models/user-type")


const existUser = async(email = '') => {
   const user = await User.findOne({email})
   if(user){
       throw new Error(`El correo ${email} ya esta en uso, ingresa otro`)
   }
}



module.exports = {existUser}