const mongoose = require('mongoose')

const deptSchema = new mongoose.Schema(
    {
        name:{ 
            type:String, 
            required:true 
        },
        manager: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref:'employeesModel', 
            required:false
        }
    }
)

const deptModel = new mongoose.model('department', deptSchema, 'departments')

module.exports = deptModel