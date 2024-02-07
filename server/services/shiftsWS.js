const shiftsRepo = require('../repositories/shiftsRepo')

const employeesRepo = require('../repositories/employeesRepo')


const getAll = async () => {
    try {
        const allShifts = await shiftsRepo.getAll()
        const integratedData = []
        for (const shift of allShifts) {
            const shiftObject = shift.toObject()
            const myEmployees = await Promise.all(shiftObject.assignedTo.map(async (employeeID)=>{
                const myEmployee = await employeesRepo.getByID(employeeID)
                return myEmployee.toObject()
            }))
    
            const myData = {
                shift:shiftObject,
                employees:myEmployees
            }
            integratedData.push(myData)
        }
        return integratedData
    } catch (error) {
        console.log("An error occurred:", error)
        return []
    }

}

const getByID = (shiftID) => {
    try {
        return shiftsRepo.getByID(shiftID)
    } catch (error) {
        console.log("An error occurred:", error)
        return {}
    }
    
}

const getByEmployeeID = (employeeID) => {
    try {
        return shiftsRepo.getByEmployeeID(employeeID)
    } catch (error) {
        console.log("An error occurred:", error)
        return []
    }
    
}


const createShift = async (shiftData) => {
    try {
        await shiftsRepo.createShift(shiftData)
        return {message:'new shift created'}
    } catch (error) {
        console.log("An error occurred:", error)
        return {message:'failed to create shift'}
    }

}

const updateShift = async (shiftID, shiftData) => {
    try {
        await shiftsRepo.updateShift(shiftID, shiftData)
        return {message:'shift updated'}
    } catch (error) {
        console.log("An error occurred:", error)
        return {message:'failed to update shift'}
    }

}

const deleteShift = async (shiftID) => {
    try {
        await shiftsRepo.deleteShift(shiftID)
        return {message:'shift deleted'}
    } catch (error) {
        console.log("An error occurred:", error)
        return {message:'failed to delete shift'}
    }


}

const assignToShift = async (employeeID, shiftID) => {
    try {
        const myShift = await shiftsRepo.getByID(shiftID)
        if (!myShift.assignedTo.includes(employeeID)) {
            myShift.assignedTo.push(employeeID)
            await myShift.save()
            return  {message:'Employee assigned to shift'}
        } else {
            return  {message:'Employee already assigned to this shift'}
        }
    } catch (error) {
        console.log("An error occurred:", error)
        return {message:'failed assigning employee to shift'}
    }

}

const unassignFromShift = async (employeeID, shiftID) => {
    try {
        const myShift = await shiftsRepo.getByID(shiftID)
        const index = myShift.assignedTo.indexOf(employeeID)
        if (index !== -1) {
            myShift.assignedTo.splice(index, 1)
            await myShift.save()
            return {message:'Employee unassigned from shift'}
        } else {
            return {message:'Employee was not assigned to this shift'}
        }
    } catch (error) {
        console.log("An error occurred:", error)
        return {message:'failed unassigning employee from shift'}
    }
 
}


module.exports = {
    getAll, 
    getByID, 
    createShift, 
    updateShift, 
    deleteShift, 
    getByEmployeeID, 
    assignToShift, 
    unassignFromShift 
}