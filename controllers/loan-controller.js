const { request, response } = require("express");
const Loan = require("../models/loan");
const Contact = require("../models/contact")
const { baseResponse, CODE_OK_RESPONSE, CODE_ERROR, CODE_NO_INFORMATION_EXISTS,CODE_NOT_ALLOWED } = require("../utils/constantsResponse");
const { findByIdAndDelete } = require("../models/loan");
const loan = require("../models/loan");



const createLoan = async (req = request,res = response) => {
    
    const {contactId,amount,dateStart,dateLimit,paymentsTime,interestPercent,interestTime,comment} = req.body
    const user = req.user
    const contact = await Contact.findById(contactId)

    if(!contact){
        return res.json(baseResponse(true,"Error al intentar crear prestamo",CODE_ERROR))
    }

    if(!user._id.equals(contact.userRequest) && !user._id.equals(contact.userPending)){
        return res.json(baseResponse(true,"Error al intentar crear prestamo",CODE_ERROR))
    }

    const userBorrower = (user._id.equals(contact.userRequest))? contact.userPending :contact.userRequest

    const loan = await Loan.create(
        {
            contactId,
            userMoneyLender: user._id,
            userBorrower,
            amount,
            dateStart,
            dateLimit,
            paymentsTime,
            interestPercent,
            interestTime,
            comment
        })

        if(!loan){
    
            return res.json(baseResponse(true,"Error al intentar crear prestamo",CODE_ERROR)) 
        }
    
        return res.json(baseResponse(true,"Prestamo creado",CODE_OK_RESPONSE,loan)) 
}

const deleteLoan = async (req = request,res = response) => {
    const loanId = req.body.loanId

    const loan = await Loan.findById(loanId)

    if(!user.id.equals(loan.userMoneyLender)){
        return res.json(baseResponse(false,"Error al intentar eliminar",CODE_NOT_ALLOWED))
    }


    const loandeleted = await Loan.findByIdAndDelete(loanId)

    if(!loandeleted) return res.json(baseResponse(false,"ese prestamo no existe", CODE_ERROR))

    return res.json(baseResponse(true,"Prestamo eliminado", CODE_OK_RESPONSE, loandeleted))
}

const updateLoan = async (req = request, res = response) => {
    const {loanId, amount, dateStart, dateLimit, paymentsTime, interestPercent} = req.body
    const user = req.user
    
    const loan = await Loan.findById(loanId)

    if(!user.id.equals(loan.userMoneyLender)){
        return res.json(baseResponse(false,"Error al intentar actualizar",CODE_NOT_ALLOWED))
    }

    const data = {
        amount,
        dateStart,
        dateLimit,
        paymentsTime,
        interestPercent
    }
    try{
        const loandUpated = await Loan.findByIdAndUpdate(loanId,data)
        if(!loandUpated) res.json(baseResponse(false,"No se encontro prestamo",CODE_NO_INFORMATION_EXISTS))
        return res.json(baseResponse(true,"Prestamo actualizado",CODE_OK_RESPONSE,loandUpated))
    }catch(error){
        return res.json(baseResponse(false,"Error al intentar actualizar",CODE_ERROR))
    }
}

const getLoans = async (req = request, res = response) => {
    const user = req.user
    
    const loans = await Loan.find({$or:[{userMoneyLender: user.id},{userBorrower:user.id}]})

    return res.json(baseResponse(true," Prestamos encontrados", CODE_OK_RESPONSE,{prueba:0,loans}))
}

const getLoansByUsertId = async (req = request, res = response) => {
    const user = req.user 
    const userId = req.body.userId
    const loans = await Loan.find({$or:[{userMoneyLender: user.id,userBorrower: userId},{userMoneyLender: userId,userBorrower: user.id}]})

    let totalLoans = 0
    let totalDebts = 0

    loans.forEach((loan) => {
         (loan.userMoneyLender.equals(user._id))? totalLoans++ : totalDebts++ 
        })

    return res.json(baseResponse(true,"Prestamos encontrados", CODE_OK_RESPONSE,{totalLoans,totalDebts,loans}))
}

const changeStatusLoan = async (req = request, res = response) => {
    const user = req.user
    const status = req.body.status
    const loanId = req.body.loanId
    const loan = await Loan.findById(loanId)

    if(!loan.userBorrower.equals(user._id)) {
        return res.json(baseResponse(false, "No se pudo aceptar prestamo", CODE_ERROR))
    }
        
    if(status == 'REJECTED'){
        const loanRejected = await Loan.findByIdAndDelete(loanId)
        if(!loanRejected) return res.json(baseResponse(false,"No se pudo eliminar restamo",CODE_ERROR))
        return res.json(baseResponse(true,"Prestamo eliminado",CODE_OK_RESPONSE,loanRejected))
    }

    if(status == 'IN_PROGRESS'){
        const loanAccepted = await Loan.findByIdAndUpdate(loanId,{status})
        if(!loanAccepted) return res.json(baseResponse(false,"No se pudo acceptar prestamo",CODE_ERROR))
        return res.json(baseResponse(true,"Prestamo aceptado",CODE_OK_RESPONSE,loanAccepted))
    }
 
    return res.json(baseResponse(false,"Error al intentar actualizar",CODE_ERROR))

}


module.exports = {
    createLoan,
    deleteLoan,
    updateLoan,
    getLoans,
    getLoansByUsertId,
    changeStatusLoan
}