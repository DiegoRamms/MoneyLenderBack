const { request, response } = require("express");
const { baseResponse, CODE_OK_RESPONSE, CODE_ERROR, CODE_NOT_ALLOWED } = require("../utils/constantsResponse");

const Loan = require('../models/loan');
const Payment = require("../models/payment");



const getLoantPaymentsDetail = async (req = request,res = response) => {
    
    const {loanId} = req.body
    const loan = await Loan.findById(loanId)
    const totalToPay = calculateSimpleTotalToPay(loan)
    const progressPayText = calculateProgressPayText(loan)
   
    const loanPaymentDetail = {
        totalToPay,
        progressPayPercentage: 100.00,
        progressPayText: "$500 de $2000",
        nextPayMoney: "$500",
        nextPayTime: new Date()
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
    
    const paymentCreated = await Payment.create({
        loanId,
        amount,
        date,
        isAccepted: isMoneyLender //if is money lender the Status is true
    })

    if(!paymentCreated) {
        return res.json(baseResponse(false,"Error al intentar crear pago",CODE_ERROR,paymentCreated))
    }
   
    return res.json(baseResponse(true,"Pago creado",CODE_OK_RESPONSE,paymentCreated))
} 



const calculateSimpleTotalToPay = (loan) =>{
   
    const time = calculateTime(loan.dateStart,loan.dateLimit)
    let interest = 0.0
    const amountMultipliedByInterest = parseFloat(loan.amount)* (parseFloat(loan.interestPercent) / 100)
    console.log(amountMultipliedByInterest)

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


const calculateProgressPayText = (loan) =>{
    return 100
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
 
module.exports = {
    getLoantPaymentsDetail,
    createPayment
}