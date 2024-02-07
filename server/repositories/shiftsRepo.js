const shiftsModel = require('../models/shiftsModel')

const getAll = () => {
    return shiftsModel.find()
}

const getByID = (shiftID) => {
    return shiftsModel.findById(shiftID)
}

const getByEmployeeID = (employeeID) => {
    return shiftsModel.find({'assignedTo':{'$in':[employeeID]}})
}

const createShift = (shiftData) => {
    const newShift = new shiftsModel(shiftData)
    return newShift.save()
}

const updateShift= (shiftID, shiftData) => {
    return shiftsModel.findByIdAndUpdate(shiftID, shiftData)
}

const deleteShift = (shiftID) => {
    return shiftsModel.findByIdAndDelete(shiftID)
}

module.exports = {
    getAll, 
    getByID, 
    createShift, 
    updateShift, 
    deleteShift, 
    getByEmployeeID
}