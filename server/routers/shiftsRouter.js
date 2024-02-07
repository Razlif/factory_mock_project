const express = require('express')

const router = express.Router()

const shiftsWS = require('../services/shiftsWS')

const usersWS = require('../services/usersWS')

router.get('/getAll', usersWS.validateAction, async (req,res) =>{
    const allShifts = await shiftsWS.getAll()
    res.send(allShifts)
})

router.get('/byID/:shiftID', usersWS.validateAction, async (req,res) => {
    const shiftID = req.params.shiftID
    const myShift = await shiftsWS.getByID(shiftID)
    res.send(myShift)
})

router.post('/create', usersWS.validateAction, async (req,res) => {
    const shiftData = req.body
    const message = await shiftsWS.createShift(shiftData)
    res.send(message)
})

router.patch('/assign', usersWS.validateAction, async (req,res) => {
    const shiftData = req.body
    const message = await shiftsWS.assignToShift(shiftData.employeeID, shiftData.shiftID)
    res.send(message)
})

router.patch('/unassign', usersWS.validateAction, async (req,res) => {
    const shiftData = req.body
    const message = await shiftsWS.unassignFromShift(shiftData.employeeID, shiftData.shiftID)
    res.send(message)
})

router.patch('/update', usersWS.validateAction, async (req,res) => {
    const shiftData = req.body
    const message = await shiftsWS.updateShift(shiftData.id, shiftData)
    res.send(message)
})

module.exports = router