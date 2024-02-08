const express = require('express')
const cors = require('cors')
const deptRouter = require('./server/routers/deptRouter')
const employeesRouter = require('./server/routers/employeesRouter')
const shiftsRouter = require('./server/routers/shiftsRouter')
const usersRouter = require('./server/routers/usersRouter')
const connectToDB = require('./server/dbConfig/dbConfig')
const app = express()
const PORT = 8000

connectToDB()

app.use(cors())

app.use(express.json())

app.use('/users', usersRouter)

app.use('/dept', deptRouter)

app.use('/team', employeesRouter)

app.use('/shifts', shiftsRouter)

app.listen(PORT, ()=>{console.log(`running on https://localhost:${PORT}`)})