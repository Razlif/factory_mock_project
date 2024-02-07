const express = require('express')

const employeeWS = require('../services/employeeWS')

const usersWS = require('../services/usersWS')

const router = express.Router()

router.get('/getAll', usersWS.validateAction, async (req,res) =>{
    const allEmployees = await employeeWS.getAll()
    res.send(allEmployees)
})

router.get('/getAllEmployees', usersWS.validateAction, async (req,res) =>{
    const allEmployees = await employeeWS.getAllEmployees()
    res.send(allEmployees)
})

router.get('/byID/:employeeID', usersWS.validateAction, async (req,res) => {
    const employeeID = req.params.employeeID
    const myEmployee = await employeeWS.getByID(employeeID)
    res.send(myEmployee)
})

router.get('/byDeptID/:deptID', usersWS.validateAction, async (req,res) => {
    const deptID = req.params.deptID
    const myEmployees = await employeeWS.getByDeptID(deptID)
    res.send(myEmployees)
})

router.get('/unassignedByDeptID/:deptID', usersWS.validateAction, async (req,res) => {
    const deptID = req.params.deptID
    const unassignedEmployees = await employeeWS.getUnassignedByDeptID(deptID)
    res.send(unassignedEmployees)
})

router.post('/create', usersWS.validateAction, async (req,res) => {
    const employeeData = req.body
    const message = await employeeWS.createEmployee(employeeData)
    res.send(message)
    
})

router.patch('/update', usersWS.validateAction, async (req,res) => {
    const employeeData = req.body
    const message = await employeeWS.updateEmployee(employeeData._id, employeeData)
    res.send(message)
})

router.delete('/delete/:employeeID', usersWS.validateAction, async (req,res) => {
    const employeeID = req.params.employeeID   
    const message = await employeeWS.deleteEmployee(employeeID)
    res.send(message) 
})

module.exports = router