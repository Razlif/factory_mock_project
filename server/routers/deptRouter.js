const express = require('express')

const deptWS = require('../services/deptWS')

const usersWS = require('../services/usersWS')

const router = express.Router()

router.get('/allData', usersWS.validateAction, async (req,res) => {
    const allDept = await deptWS.getAll()
    res.status(200).send(allDept)
    })


router.get('/byID/:deptID', usersWS.validateAction, async (req,res) => {
    const deptID = req.params.deptID
    const myDept = await deptWS.getByID(deptID)
    res.send(myDept)
})

router.post('/create', usersWS.validateAction, async (req,res) => {
    const deptData = req.body
    const message = await deptWS.createDept(deptData)
    res.send(message) 
})

router.patch('/update', usersWS.validateAction, async (req,res) => {
    const deptData = req.body
    const message = await deptWS.updateDept(deptData._id, deptData)
    res.send(message)
})

router.delete('/delete/:deptID', usersWS.validateAction, async (req,res) => {
    const deptID = req.params.deptID
    const message = await deptWS.deleteDept(deptID)
    res.send(message)
})

module.exports = router