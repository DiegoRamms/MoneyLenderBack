const { request, response } = require("express");
const loan = require("../models/loan");
const Loan = require("../models/loan");
const Payment = require("../models/payment");
const user = require("../models/user");
const { use } = require("../routes/main-detail-routes");
const { baseResponse, CODE_OK_RESPONSE } = require("../utils/constantsResponse");
const { PAYMENT, DEBT } = require("../utils/constApp");
const { calculateSimpleTotalToPay } = require("./payment-controller");




const getMainDetail = async(req = request, res = response) => {
    const user = req.user
    const greeting =`Hola ${user.name}`
    const loansInProgress = await Loan.find({userMoneyLender: user._id, status: 'IN_PROGRESS'}).populate('userBorrower','name')
    const loansAmount = getLoansAmount(loansInProgress)
    const loansPercentagePaid = await getLoansAmountPercentPaid(loansAmount,loansInProgress)
    const debtsInProgress = await Loan.find({userBorrower: user._id,status: 'IN_PROGRESS'}).populate('userMoneyLender','name')
    const debtsAmount = getLoansAmount(debtsInProgress)
    const debtsPercentagePaid = await getLoansAmountPercentPaid(debtsAmount,debtsInProgress)
    const loansCount = loansInProgress.length
    const debtsCount = debtsInProgress.length 
    const transactions = await getTransactions(user, loansInProgress, debtsInProgress)
    const loanDue = await getLoanDue(user)
    
    return res.json(baseResponse(true,"OK",CODE_OK_RESPONSE,{
        greeting,
        loansAmount,
        loansPercentagePaid,
        debtsAmount,
        debtsPercentagePaid,
        loansCount,
        debtsCount,
        transactions,
        loanDue
    }))
}

const getLoanDue = async(user) => {
    const loans = await Loan.find({userMoneyLender: user._id})
    const loanDue = (loans.sort((a,b) =>  a.dateLimit - b.dateLimit))[0]
    return  loanDue
}

const getTransactions = async (user, loansInProgress, debtsInProgress) => {

    let transactions = []
  
 
    const  [loansTransactions, debtsTransactions] = await Promise.all(
        [
            createTransactions(PAYMENT,loansInProgress),
            createTransactions(DEBT,debtsInProgress)
        ]
    )

    transactions = loansTransactions.concat(debtsTransactions)
    
    return transactions.sort((a,b) => a.date - b.date)
}

const createTransactions = async (type, loans ) => {
    let transactions = []
    let payments = []

    await Promise.all(loans.map( async loan => {

        payments = await Payment.find({loanId: loan.id})
        
        payments.forEach( payment => {
            transactions.push( {
                id: payment._id,
                name: (type == DEBT)? loan.userMoneyLender.name : loan.userBorrower.name ,
                date: payment.date,
                amount: payment.amount,
                type: type,
                isAccepted: payment.isAccepted
            })
        })

    }))

    return transactions
}

const getLoansAmount = (loans) => {
    let amount = 0.0
    loans.forEach(loan  => {
        amount = amount + calculateSimpleTotalToPay(loan)
    })
    return amount
}

const getLoansAmountPercentPaid = async (loansAmount,loans) => {
    let totalPayments = 0.0    

    if(loans.isEmpty)return 0
    if(loansAmount == 0) return 0
    
    await Promise.all(loans.map(async loan => {
        totalPayments = totalPayments + await getTotalAmountPaid(loan._id)
    } ))
   
    const percentage = (totalPayments * 100) / loansAmount
    console.log(percentage)
    return Math.round(percentage)
}

const getTotalAmountPaid = async (loanId) => {
    let totalPayments = 0.0

    const payments = await Payment.find({loanId, isAccepted: true})
    console.log(payments.length)
     payments.forEach(payment => {
        totalPayments += parseFloat(payment.amount)
    })

    console.log(totalPayments)

    return totalPayments
}



module.exports = {
    getMainDetail
}