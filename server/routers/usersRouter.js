const express = require('express')

const router = express.Router()

const usersWS = require('../services/usersWS')

router.get('/getAll', usersWS.validateAction, async (req,res) => {
    const allUsers = await usersWS.getAll()
    res.send(allUsers)
})

router.post('/login', async (req,res) => {
    const username = req.body.username
    const email = req.body.email
    const userData = await usersWS.login(username, email)
    res.send(userData)
})

module.exports = router