const employeesModel = require('../models/employeesModel')

const getAll = () => {
    return employeesModel.find()
}

const getByID = (employeeID) => {
    return employeesModel.findById(employeeID)
}

const getByDeptID = (deptID) => {
    return employeesModel.find({deptID:deptID})
}

const getUnassignedByDeptID = (deptID) => {
    return employeesModel.find({ deptID: { $ne: deptID } })
}

const createEmployee = (employeeData) => {
    const newEmployee = new employeesModel(employeeData)
    return newEmployee.save()
}

const updateEmployee= (employeeID, employeeData) => {
    return employeesModel.findByIdAndUpdate(employeeID, employeeData)
}

const deleteEmployee = (employeeID) => {
    return employeesModel.findByIdAndDelete(employeeID)
}

module.exports = {
    getAll, 
    getByID, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee, 
    getByDeptID, 
    getUnassignedByDeptID
}