const mongoose = require('mongoose')

const DBname = 'factoryDB'

const DBservicePort = '27017'

const connectToDB = () => {
    mongoose
        .connect(`mongodb://127.0.0.1:${DBservicePort}/${DBname}`)
        .then(()=>{console.log(`connected to ${DBname}`)})
        .catch((err)=>{console.log(err)})
}

module.exports = connectToDB