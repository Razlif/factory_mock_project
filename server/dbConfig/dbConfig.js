const mongoose = require('mongoose')

const DBname = process.env.DB_NAME || 'factoryDB'

const DBservicePort = process.env.MONGODB_SERVICE || '27017'

const connectToDB = () => {
    mongoose
        .connect(`mongodb://127.0.0.1:${DBservicePort}/${DBname}`)
        .then(()=>{console.log(`connected to ${DBname}`)})
        .catch((err)=>{console.log(err)})
}

module.exports = connectToDB