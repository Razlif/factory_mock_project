const employeesRepo = require('../repositories/employeesRepo')

const deptRepo = require('../repositories/deptRepo')

const shiftsWS= require('./shiftsWS')


const getAll = async () => {
    try {
        const allEmployees = await employeesRepo.getAll()
        const integratedData = []
        for (const employee of allEmployees) {
            myEmp = employee.toObject()
            const myDept = await deptRepo.getByID(myEmp.deptID)
            const myShifts = await shiftsWS.getByEmployeeID(myEmp._id)
            const myData = {
                employee:myEmp,
                department:myDept ? myDept.toObject() : 'none',
                shifts: myShifts.map(shift=>shift.toObject())
            }
            integratedData.push(myData)
        }
        return integratedData
    } catch (error) {
        console.log("An error occurred:", error)
        return []
    }

}


const getAllEmployees = async () => {
    try {
        const allEmployees = await employeesRepo.getAll()
        const integratedData = []
        const managerIDs = await getManagers()
        for (const employee of allEmployees) {
            myEmp = employee.toObject()
            const isManager = managerIDs.includes(myEmp._id)
            if (!isManager) {
                const myDept = await deptRepo.getByID(myEmp.deptID)
                const myShifts = await shiftsWS.getByEmployeeID(myEmp._id)
                const myData = {
                    employee:myEmp,
                    department:myDept.toObject(),
                    shifts: myShifts.map(shift=>shift.toObject())
                }
                integratedData.push(myData)
            }
    
        }
        return integratedData
    } catch (error) {
        console.log("An error occurred:", error)
        return []
    }

}

const getByID = (employeeID) => {
    try {
        return employeesRepo.getByID(employeeID)
    } catch (error) {
        console.log("An error occurred:", error)
        return {}
    }
    
}

const getManagers = async () => {
    try {
        const allDepts = await deptRepo.getAll()
        const managerIDs = []
        for( const dept of allDepts) {
            if (dept.manager) {
                managerIDs.push(dept.manager.toString())
            }
        }
        return managerIDs
    } catch (error) {
        console.log("An error occurred:", error)
        return []
    }

}

const getByDeptID = (deptID) => {
    try {
        return employeesRepo.getByDeptID(deptID)
    } catch (error) {
        console.log("An error occurred:", error)
        return []
    }
    
}


const getUnassignedByDeptID = async (deptID) => {
    try {
        const unassignedEmployees = await employeesRepo.getUnassignedByDeptID(deptID)
        const integratedData = []
        const managerIDs = await getManagers()
        for(const emp of unassignedEmployees) {
            const isManager = managerIDs.includes(emp._id.toString())
            if (!isManager) {
                integratedData.push(emp)
            }
        }
    
        return integratedData
    } catch (error) {
        console.log("An error occurred:", error)
        return []
    }

}

const createEmployee = async (employeeData) => {
    try {
        await employeesRepo.createEmployee(employeeData)
        return {message:'employee created'}
    } catch (error) {
        console.log("An error occurred:", error)
        return {message:'failed to create employee'}
    }

}


const updateEmployee = async (employeeID, employeeData) => {
    try {
        const managerIDs = await getManagers()
        const isManager = managerIDs.includes(employeeID.toString())
        if(!isManager) {
            await employeesRepo.updateEmployee(employeeID, employeeData)
            return {message:'employee updated'}
        } else {
            return {message:'can not edit a manager'}
        }
    } catch (error) {
        console.log("An error occurred:", error)
        return {message:'failed to edit employee'}
    }

}

const deleteEmployee = async (employeeID) => {
    try {
        const managerIDs = await getManagers()
        const isManager = managerIDs.includes(employeeID.toString())
        if(!isManager) {
            const myShifts = await shiftsWS.getByEmployeeID(employeeID)
            console.log(myShifts)
            for(const shift of myShifts) {
                console.log(shift._id)
                await shiftsWS.unassignFromShift(employeeID, shift._id)
            }
            await employeesRepo.deleteEmployee(employeeID)
            return {message:'employee deleted'}
        } else {
            return {message:'can not delete a manager'}
        }
    } catch (error) {
        console.log("An error occurred:", error)
        return {message:'failed to delete employee'}
    }

}

module.exports = {
    getAll,
    getByID,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getByDeptID,
    getUnassignedByDeptID,
    getManagers,
    getAllEmployees
}