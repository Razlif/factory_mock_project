const deptRepo = require('../repositories/deptRepo')

const employeeWS = require('../services/employeeWS')

const getAll = async () => {
    try{
        const allDept = await deptRepo.getAll()
        const integratedData = []
        for (const dept of allDept) {
            const deptObject = dept.toObject()
            const deptEmployees = await employeeWS.getByDeptID(deptObject._id)
            const deptManager = await employeeWS.getByID(deptObject.manager)
            const myNewData = {
                department:deptObject, 
                manager:deptManager ? deptManager.toObject() :'None',
                employees:deptEmployees.map(emp=>emp.toObject()) 
            }
            integratedData.push(myNewData)
        }
        return integratedData
    } catch (error) {
        console.log("An error occurred:", error)
        return []
    }
}

const getByID = (deptID) => {
    try{
        return deptRepo.getByID(deptID)
    } catch(error) {
        console.log("An error occurred:", error)
        return {}
    }
    
}

const createDept = async (deptData) => {
    try{
        await deptRepo.createDept(deptData)
        return {message:"department created"}
    } catch(error) {
        console.log("An error occurred:", error)
        return {message:"failed to create department"}
    }

}


const updateDept = async (deptID, deptData) => {
    try {
        await deptRepo.updateDept(deptID, deptData)
        return {message:'department updated'}
    } catch(error) {
        console.log("An error occurred:", error)
        return {message:"failed to update department"}
    }

}

const deleteDept = async (deptID) => {
    try {
        const myEmployees = await employeeWS.getByDeptID(deptID)
        // remove manager
        const updatedDept = {
            manager:null,
        }
        await updateDept(deptID, updatedDept)
        
        console.log(myEmployees)
        for (const emp of myEmployees) {
            await employeeWS.deleteEmployee(emp._id)
        }
        await deptRepo.deleteDept(deptID)
        return {message:'department deleted'}
    } catch(error) {
        console.log("An error occurred:", error)
        return {message:"failed to delete department"}
    }

}

module.exports = {
    getAll, 
    getByID, 
    createDept, 
    updateDept, 
    deleteDept
}