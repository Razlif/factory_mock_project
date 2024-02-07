const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema(
    {
        firstName:{ 
            type:String, 
            required:true 
        },
        lastName:{ 
            type:String, 
            required:true 
        },
        startWorkYear:{ 
            type:Number, 
            required:true 
        },
        deptID: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref:'deptModel', 
            required:true
        }
    }
)

const employeeModel = new mongoose.model('employee', employeeSchema, 'employees')

module.exports = employeeModel