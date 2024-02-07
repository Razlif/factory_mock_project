const deptModel = require('../models/deptModel')

const getAll = () => {
    return deptModel.find()
}

const getByID = (deptID) => {
    return deptModel.findById(deptID)
}

const createDept = (deptData) => {
    const newDept = new deptModel(deptData)
    return newDept.save()
}

const updateDept = (deptID, deptData) => {
    return deptModel.findByIdAndUpdate(deptID, deptData)
}

const deleteDept = (deptID) => {
    return deptModel.findByIdAndDelete(deptID)
}

module.exports = {
    getAll, 
    getByID, 
    createDept, 
    updateDept, 
    deleteDept
}