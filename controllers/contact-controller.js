const { compare } = require("bcryptjs")
const { request, response, json } = require("express")
const Contact = require("../models/contact")
const User = require("../models/user")
const { baseResponse, CODE_OK_RESPONSE, CODE_ERROR, CODE_CANT_ADD,  } = require("../utils/constantsResponse")

const addContact = async (req = request, res = response) => {
    const { code } = req.body
    const user = req.user

    const userToAdd = await User.findOne({ code, status: true })

    const userAdded = await Contact.findOne({ $or: [{ userRequest: user, userPending: userToAdd }, { userRequest: userToAdd, userPending: user }] })


    if (userAdded) {
        return res.json(
            baseResponse(
                false,
                "El usuario que deseas agregar ya fue agregado, ya tiene una solicitud, o aún no lo haz aceptado",
                CODE_CANT_ADD
            )
        )
    }

    const addUser = await Contact.create({ userRequest: user, userPending: userToAdd })

    if (!userToAdd) {
        return res.json(
            baseResponse(
                false,
                "El usuario no existe",
                CODE_ERROR
            )
        )
    }
    return res.json(
        baseResponse(
            true,
            `${user.name} se mandado solicitud para agregar al usuario  ${userToAdd.name} con codigo ${code}`,
            CODE_OK_RESPONSE,
            userToAdd
        )
    )
}

const pendingContacts = async (req = request, res = response) => {
    const user = req.user
    const contact = await Contact.find({ userRequest: user, userPendingAccepted: false }).populate('userPending', 'name email code')
    let contactRes = []
    contact.forEach((item) => {
        contactRes.push({
            userId: item.userPending._id,
            name: item.userPending.name,
            email: item.userPending.email,
            code: item.userPending.code,
            contactId: item._id
        })
    })
    res.json(baseResponse(true, (contact) ? 'Solicutudes pendientes' : 'Sin solicitudes', CODE_OK_RESPONSE, contactRes))
}

const contactsToAccpet = async (req = request, res = response) => {
    const user = req.user
    const contactsToAccept = await Contact.find({ userPending: user, userPendingAccepted: false }).populate('userRequest', 'name email code')
   
    let contactsRes = []

    contactsToAccept.forEach(item => {
        contactsRes.push({
            userId: item.userRequest._id,
            name: item.userRequest.name,
            email: item.userRequest.email,
            code: item.userRequest.code,
            contactId: item._id
        })
    })
    return res.json(baseResponse(true,(contactsToAccept) ? 'Solicitudes pendientes' : 'Sin solicitudes pendientes',CODE_OK_RESPONSE,contactsRes))
}

const getContacts = async (req = request, res = response) => {
    const user = req.user
    let listMerge = []

    const promiseFromRequest = Contact.find({ userPending: user, userRequesAccepted: true, userPendingAccepted: true }).populate('userRequest', 'name email code')
    const promiseFromPending = Contact.find({ userRequest: user, userRequesAccepted: true, userPendingAccepted: true }).populate('userPending', 'name email code')

    const [listContactsFromRequest, listContactsFromPending] = await Promise.all([
        promiseFromRequest, promiseFromPending
    ])

    console.log(user)
    listContactsFromRequest.forEach((item) => {
        const contact = {
            userId: item.userRequest._id,
            name: item.userRequest.name,
            email: item.userRequest.email,
            code: item.userRequest.code,
            contactId: item._id
        }
        listMerge.push(contact)
    })

    listContactsFromPending.forEach((item) => {
        const contact = {
            userId: item.userPending._id,
            name: item.userPending.name,
            email: item.userPending.email,
            code: item.userPending.code,
            contactId: item._id
        }
        listMerge.push(contact)
    })
    //await new Promise(resolve => setTimeout(resolve, 5000));

    return res.json(baseResponse(true, "Contactos", CODE_OK_RESPONSE, listMerge))
}

const accept = async (req = request, res = response) => {
    const { contactId } = req.body
    const data = {
        userPendingAccepted: true
    }
    const contactUpdated = await Contact.findByIdAndUpdate(contactId, data, { new: true }).populate('userRequest','name email code')
    

    
    return res.json(baseResponse(true,'Contacto aceptado',CODE_OK_RESPONSE,{
        name: contactUpdated.userRequest.name,
        email: contactUpdated.userRequest.email,
        code: contactUpdated.userRequest.code,
        contactId: contactUpdated._id
    }))

}

const deleteRequest = async (req, res) => {
    const { contactId } = req.body
    try {
        await Contact.findByIdAndDelete(contactId)
        return res.json(baseResponse(true, "Solicitud cancelada", CODE_OK_RESPONSE))
    } catch (error) { 
        return res.json(baseResponse(true, "Error al intentar eliminar esta solicitud", CODE_OK_RESPONSE))
    }
}




module.exports = {
    addContact,
    pendingContacts,
    contactsToAccpet,
    getContacts,
    accept,
    deleteRequest
}