const { request, response } = require("express");
const { baseResponse, CODE_OK_RESPONSE, CODE_ERROR, CODE_NOT_ALLOWED } = require("../utils/constantsResponse");

const Loan = require('../models/loan');
const Payment = require("../models/payment");



const getLoantPaymentsDetail = async (req = request,res = response) => {
    
    const {loanId} = req.body
    const {user} = req
    const loan = await Loan.findById(loanId)
    const totalToPay = calculateSimpleTotalToPay(loan)
    const payments = await Payment.find({loanId:loan._id})
    const progressPayText = calculateProgressPayText(payments)
    const progressPayPercentage = calculateProgressPercent(totalToPay, payments)
    const isPaidOut = getValuePaidOut(totalToPay, payments)
    

    const loanPaymentDetail = {
        totalToPay,
        progressPayPercentage,
        progressPayText,
        nextPayMoney: "$500",
        nextPayTime: new Date(),
        isPaidOut,
        payments
    }

    return res.json(baseResponse(true,"Detalle de pagos",CODE_OK_RESPONSE,loanPaymentDetail))
}


const createPayment = async (req = request,res = response) =>{
    
    const userId = req.user._id
    const {loanId,amount,date} = req.body
    const loan = await Loan.findById(loanId)
    const isMoneyLender = loan.userMoneyLender.equals(userId)
    const isBorrower = loan.userBorrower.equals(userId)
    

    
    if(!isMoneyLender && !isBorrower){
        return res.json(baseResponse(false,"Error al intentar crear pago",CODE_NOT_ALLOWED,null))
    }

    if(amount <= 0){
        return res.json(baseResponse(false, "Ingresa una cantidad mayor a 0",CODE_ERROR,null))
    }

    const totalPayments = await getTotalPaymentsByLoanId(loanId)
    const diferenceAmountToPay = (parseFloat(loan.amount) - parseFloat(totalPayments))
    console.log(diferenceAmountToPay)
    if(parseFloat(amount) > diferenceAmountToPay){
        return res.json(baseResponse(false, "No puede pasar la cantidad total prestada ",CODE_ERROR,null))
    }

    
    const paymentCreated = await Payment.create({
        loanId,
        user: userId,
        amount,
        date,
        isAccepted: isMoneyLender //if is moneylender the Status is true
    })

    if(!paymentCreated) {
        return res.json(baseResponse(false,"Error al intentar crear pago",CODE_ERROR,paymentCreated))
    }
   
    return res.json(baseResponse(true,"Pago creado",CODE_OK_RESPONSE,paymentCreated))
} 

const getPaymentsByLoanId = async (req = request, res = response) => {
    
    const { loanId } = req.body
    const loan = await Loan.findById(loanId)
    console.log('asd'+loan)
    const payments = await Payment.find({loanId})

    return res.json(baseResponse(true,"Prestamos obtenidos",CODE_OK_RESPONSE,payments))

}

const acceptPayment = async (req = request, res = response) => {
    const { paymetId } = req.body
    //const payment = await Payment.findByIdAndUpdate( paymetId, {isAccepted: true} )
    return res.json(baseResponse(true,"Prestamo aceptado", CODE_ERROR, paymetId ))
}

const calculateSimpleTotalToPay = (loan) =>{
   
    const time = calculateTime(loan.dateStart,loan.dateLimit)
    let interest = 0.0
    const amountMultipliedByInterest = parseFloat(loan.amount)* (parseFloat(loan.interestPercent) / 100)

    if(loan.interestTime == 'YEARLY'){
        interest = amountMultipliedByInterest * parseFloat(time.years)
    }else if(loan.interestTime == 'MONTHLY'){
        interest = amountMultipliedByInterest * parseFloat(time.months)
    }else if(loan.interestTime == 'ONCE'){
        interest = amountMultipliedByInterest 
    }
    const amountPlusInterest = parseFloat(loan.amount) + parseFloat(interest)
    
    return amountPlusInterest
}


const calculateProgressPayText = ( payments) =>{
    return `${getTotalAmountPayments(payments)}`
}

const calculateProgressPercent = (totalToPay, payments) => {
    return (getTotalAmountPayments(payments) * 100) /totalToPay
}

const getTotalAmountPayments = (payments) => {
    let totalAmountPayments = 0.0
    payments.forEach(item => {
        if(item.isAccepted) totalAmountPayments += parseFloat(item.amount)
    })
    return totalAmountPayments
}

const calculateTime = (dateStart, dateLimit) => {
    const millisecondMinute = 1000 * 60;
    const millisecondHour = millisecondMinute * 60
    const millisecondDay = millisecondHour * 24
    const differenceTime = dateLimit.getTime() - dateStart.getTime()

    var days = Math.floor(differenceTime/millisecondDay);
    var weeks = Math.floor(days/7)
    var months = Math.floor(days/31);
    var years = Math.floor(months/12);

    return {
        days,
        weeks,
        months,
        years
    }
    
} 

const getValuePaidOut = (totalToPay,payments) => {
    return totalToPay <= getTotalAmountPayments(payments)
}

const getTotalPaymentsByLoanId = async(loanId) => {
    let totalAmount = 0.0
    const payments = await Payment.find({loanId})
    payments.forEach(payment => {totalAmount = totalAmount + parseFloat(payment.amount)})
    return  totalAmount
}
 
module.exports = {
    getLoantPaymentsDetail,
    createPayment,
    getPaymentsByLoanId,
    acceptPayment,
    calculateSimpleTotalToPay
}