const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')
const helmet = require('helmet')

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT
        this.authPath = '/auth'
        this.userPath = '/user'
        this.contactPath = '/contact'
        this.loanPath = '/loan'
        this.paymentPath ='/payment'
        this.mainDetailPath = '/main'
        
        // Conectar a base de datos
        this.conectarDB()
        // Middelwares
        this.middlewares()
        // Rutas Aplicacion
        this.routes()
    }

    async conectarDB(){
        await dbConnection()
    }

    middlewares(){

        // CORS
        this.app.use(cors())

        // Parseo y lectura del
        this.app.use(express.json())

        // Directorio publico
        this.app.use( express.static('public') )

        // Helmet
        this.app.use(helmet())
    }

    routes(){
        this.app.use(this.authPath,require('../routes/auth-routes'))
        this.app.use(this.userPath,require('../routes/user-routes'))
        this.app.use(this.contactPath,require('../routes/contacts-routes'))
        this.app.use(this.loanPath,require('../routes/loan-routes'))
        this.app.use(this.paymentPath,require('../routes/payment-routes'))
        this.app.use(this.mainDetailPath,require('../routes/main-detail-routes'))
    }

    listen(){
        this.app.listen(process.env.PORT,() => {
            console.log('Server running at port', this.port)
        })
    }

}


module.exports = Server