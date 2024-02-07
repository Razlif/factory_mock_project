const usersModel = require('../models/usersModel')

const getAll = () => {
    return usersModel.find()
}

const getByID = (userID) => {
    return usersModel.findById(userID)
}

const getByCustomID = (customUserID) => {
    return usersModel.findOne({customID:customUserID})
}

const createUser = (userData) => {
    const newUser = new usersModel(userData)
    return newUser.save()
}

const updateUser= (userID, userData) => {
    return shiftsModel.findByIdAndUpdate(userID, userData)
}

const deleteUser = (userID) => {
    return usersModel.findByIdAndDelete(userID)
}

module.exports = {
    getAll, 
    getByID, 
    createUser, 
    updateUser, 
    deleteUser, 
    getByCustomID
}