const mongoose = require('mongoose')

const dbConnection = async() => {

    try{
        await mongoose.connect(process.env.MONGODB_ATLAS,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log("Base de datos online")
        
    }catch(error){
        console.log(e)
        throw new Error('Error al iniciar BD')
    }

}



module.exports = {
    dbConnection
}