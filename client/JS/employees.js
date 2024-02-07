

// load employees page
async function loadEmployeesPage() {
    const response = await fetch('http://127.0.0.1:8000/team/getAll' , {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'count-action':'true',
            'accessToken': `${sessionStorage['accessToken']}`
        }
    })
    if (response.ok) {
        const allEmployees = await response.json()
        const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0]
    
        // create the employee data rows
        allEmployees.forEach(emp => {
    
            // parse shifts
            const myShifts = emp.shifts.map(shift=>{
                const myShift = new Date(shift.date).toLocaleDateString() + ' ' + shift.startingHour + '-' + shift.endingHour
                return myShift
            })
            
            //create row
            const newRow = tableBody.insertRow()
    
            const editEmployeeLink = document.createElement('a')
            editEmployeeLink.href = `editEmployees.html?id=${emp.employee._id}`
            editEmployeeLink.textContent = `${emp.employee.firstName} ${emp.employee.lastName}`
            newRow.insertCell(0).appendChild(editEmployeeLink)
            
            newRow.insertCell(1).textContent = `${emp.employee.startWorkYear}`
    
            const editDeptLink = document.createElement('a')
            editDeptLink.href = `editDepts.html?id=${emp.department._id}`
            editDeptLink.textContent = `${emp.department.name}`
            newRow.insertCell(2).appendChild(editDeptLink)
    
    
            newRow.insertCell(3).textContent = `${myShifts}`
    
            tableBody.appendChild(newRow)
    
        })
        
        // populate the departmnent dropdown
        await populateDeptDropDown()
    } else {
        window.location.href = './login.html'
    }

}


// add departments to the dropdown menu
async function populateDeptDropDown() {
    const allData = await fetch('http://127.0.0.1:8000/dept/allData' , {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'count-action':'false',
            'accessToken': `${sessionStorage['accessToken']}`
        }
    })
    const allDepts = await allData.json()
    const deptSelector = document.getElementById('deptSelector')
    allDepts.forEach(dept=>{
        const dropDownOption = document.createElement('option')
        dropDownOption.value = dept.department._id
        dropDownOption.textContent = dept.department.name
        deptSelector.appendChild(dropDownOption)
    })
}


// filter employees page based on dropdown
function filterEmployeesData() {
    const deptSelector = document.getElementById('deptSelector');
    const selectedDeptName = deptSelector.options[deptSelector.selectedIndex].textContent
    const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0]
    const dataRows = tableBody.rows
    for ( const row of dataRows) {
        if ( selectedDeptName === 'All' || selectedDeptName === row.cells[2].textContent) {
            row.hidden = false
        } else {
            row.hidden = true
        }
    }
    
}


//add employee
async function addEmployee() {
    const firstName = document.getElementById('firstName').value
    const lastName = document.getElementById('lastName').value
    const startWorkYear = document.getElementById('startYear').value
    const deptID = document.getElementById('deptSelector').value
    const newEmployee = {
        firstName,
        lastName,
        startWorkYear,
        deptID
    }
    console.log(newEmployee)
    const response = await fetch('http://127.0.0.1:8000/team/create', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'count-action':'true',
            'accessToken': `${sessionStorage['accessToken']}`
        },
        body:JSON.stringify(newEmployee)
    })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
    
        const messages = document.getElementById('messages')
        messages.innerHTML = ''
        const message = document.createElement('div')
        message.textContent = data.message
        messages.appendChild(message)
    } else {
        window.location.href = './login.html'
    }


}

async function loadEditEmployeePage() {

    // populate the departmnent dropdown
    await populateDeptDropDown()

    // get the employee data
    const currentURL = new URL(window.location.href)
    const employeeID = currentURL.searchParams.get('id')
    const response = await fetch(`http://127.0.0.1:8000/team/byID/${employeeID}` , {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'count-action':'true',
            'accessToken': `${sessionStorage['accessToken']}`
        }
    })
    if (response.ok) {
        const employeeData = await response.json()
        console.log(employeeData)
        document.getElementById('employeeID').textContent = employeeData._id
        document.getElementById('firstName').value = employeeData.firstName
        document.getElementById('lastName').value = employeeData.lastName
        document.getElementById('startYear').value = employeeData.startWorkYear
        
    
        const deptSelector = document.getElementById('deptSelector')
        deptSelector.value = employeeData.deptID
    
        // get the shifts
        const shiftsResponse = await fetch(`http://127.0.0.1:8000/shifts/getAll` , {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'count-action':'false',
                'accessToken': `${sessionStorage['accessToken']}`
            }
        })
        const shiftsData = await shiftsResponse.json()
        console.log(shiftsData)
        const assignedTo = []
        const notAssignedTo = []
        for (const shift of shiftsData) {
            if (shift.shift.assignedTo.includes(employeeID)) {
                assignedTo.push(shift)
            } else {
                notAssignedTo.push(shift)
            }
        }
    
        const shiftsTableBody = document.getElementById('shiftsTable')
        shiftsTableBody.innerHTML = ''
        for (const item of assignedTo) {
            const newRow = shiftsTableBody.insertRow()
            const shiftDate = new Date(item.shift.date).toLocaleDateString();
            const shiftString =  `Date: ${shiftDate}, Hours: ${item.shift.startingHour} - ${item.shift.endingHour}`
            newRow.insertCell(0).textContent = shiftString
            shiftsTableBody.appendChild(newRow)
        }
    
        const availableShiftstableBody = document.getElementById('availableShiftsTable')
        availableShiftstableBody.innerHTML = ''
        for (const item of notAssignedTo) {
            const newRow = availableShiftstableBody.insertRow()
            const shiftDate = new Date(item.shift.date).toLocaleDateString();
            const shiftString =  `Date: ${shiftDate}, Hours: ${item.shift.startingHour} - ${item.shift.endingHour}`
            const assignBtn = document.createElement('button')
            assignBtn.textContent = 'Assign to shift'
            assignBtn.onclick = () => assignToShift(item.shift._id,document.getElementById('employeeID').textContent)
            
            newRow.insertCell(0).textContent = shiftString
            newRow.insertCell(1).appendChild(assignBtn)
    
            availableShiftstableBody.appendChild(newRow)
        }
    } else {
        window.location.href = './login.html'
    }

    

}

async function assignToShift(shiftID, employeeID) {
    const response = await fetch('http://127.0.0.1:8000/shifts/assign', {
        method:'PATCH',
        headers:{
            'content-Type':'application/json',
            'count-action':'false',
            'accessToken': `${sessionStorage['accessToken']}`
        },
        body:JSON.stringify({
            shiftID:shiftID,
            employeeID:employeeID
        })
    })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
        loadEditEmployeePage()
        const messages = document.getElementById('messages')
        messages.innerHTML = ''
        const message = document.createElement('div')
        message.textContent = data.message
        messages.appendChild(message)
    } else {
        window.location.href = './login.html'
    }

}

async function unassignFromShift(shiftID, employeeID) {
    const response = await fetch('http://127.0.0.1:8000/shifts/unassign', {
        method:'PATCH',
        headers:{
            'content-Type':'application/json',
            'count-action':'false',
            'accessToken': `${sessionStorage['accessToken']}`
        },
        body:JSON.stringify({
            shiftID:shiftID,
            employeeID:employeeID
        })
    })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
        loadEditEmployeePage()
        const messages = document.getElementById('messages')
        messages.innerHTML = ''
        const message = document.createElement('div')
        message.textContent = data.message
        messages.appendChild(message)
    } else {
        window.location.href = './login.html'
    }

}

async function editEmployee() {
    const firstName = document.getElementById('firstName').value
    const lastName = document.getElementById('lastName').value
    const startWorkYear = document.getElementById('startYear').value
    const deptID = document.getElementById('deptSelector').value
    const employeeID = document.getElementById('employeeID').textContent
    const updatedEmployee = {
        _id:employeeID,
        firstName,
        lastName,
        startWorkYear,
        deptID
    }
    console.log(updatedEmployee )
    const response = await fetch('http://127.0.0.1:8000/team/update', {
        method:'PATCH',
        headers:{
            'Content-Type':'application/json',
            'count-action':'true',
            'accessToken': `${sessionStorage['accessToken']}`
        },
        body:JSON.stringify(updatedEmployee)
    })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
    
        const messages = document.getElementById('messages')
        messages.innerHTML = ''
        const message = document.createElement('div')
        message.textContent = data.message
        messages.appendChild(message)
    } else {
        window.location.href = './login.html'
    }

}

async function deleteEmployee() {
    const response = await fetch(`http://127.0.0.1:8000/team/delete/${document.getElementById('employeeID').textContent}`, {
        method:'DELETE',
        headers:{
            'Content-Type':'application/json',
            'count-action':'true',
            'accessToken': `${sessionStorage['accessToken']}`
        },
    })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
    
        const messages = document.getElementById('messages')
        messages.innerHTML = ''
        const message = document.createElement('div')
        message.textContent = data.message
        messages.appendChild(message)
        // window.location.href = 'employees.html'
    } else {
        window.location.href = './login.html'
    }

}

