const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema(
    {
        name:{ 
            type:String, 
            required:true 
        },
        numOfActions: { 
            type: Number,
            required:true
        },
        customID: { 
            type: Number,
            required:true
        }
    }
)

const usersModel = new mongoose.model('user', usersSchema, 'users')

module.exports = usersModel