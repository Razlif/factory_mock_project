const mongoose = require('mongoose')

const shiftsSchema = new mongoose.Schema(
    {
        date:{ 
            type:Date, 
            required:true 
        },
        startingHour:{ 
            type:Number, 
            required:true 
        },
        endingHour:{ 
            type:Number, 
            required:true 
        },
        assignedTo:[{ 
            type:mongoose.Schema.Types.ObjectId,
            ref:'employeesModel'
        }],
    }
)

const shiftsModel = new mongoose.model('shift', shiftsSchema, 'shifts')

module.exports = shiftsModel