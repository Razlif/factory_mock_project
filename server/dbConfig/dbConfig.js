const mongoose = require('mongoose')

const DBname = process.env.DB_NAME

const DBservicePort = process.env.MONGODB_SERVICE

const connectToDB = () => {
    mongoose
        .connect(`mongodb://127.0.0.1:${DBservicePort}/${DBname}`)
        .then(()=>{console.log(`connected to ${DBname}`)})
        .catch((err)=>{console.log(err)})
}

module.exports = connectToDB