
//load shifts page
async function loadShiftsPage() {
    const response = await fetch('http://127.0.0.1:8000/shifts/getAll' , {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'count-action':'true',
            'accessToken': `${sessionStorage['accessToken']}`
        }
    })
    if (response.ok) {
        const allShifts= await response.json()
        const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0]
        tableBody.innerHTML = ''
        const shiftContainer = document.getElementById('shiftContainer')
        shiftContainer.innerHTML = ''
        
        //create depts data rows
        allShifts.forEach(shiftObj=>{
            //create row
            const newRow = tableBody.insertRow()
    
            const myShift = new Date(shiftObj.shift.date).toLocaleDateString() + ' ' + shiftObj.shift.startingHour + '-' + shiftObj.shift.endingHour
            newRow.insertCell(0).textContent = myShift
    
            const empCell = newRow.insertCell(1)
            for (const emp of shiftObj.employees) {
                const employeeName = document.createElement('p')
                employeeName.textContent = ` ${emp.firstName} ${emp.lastName} `
                empCell.appendChild(employeeName)
            }
    
            const selectCell = newRow.insertCell(2)
            const selectBtn = document.createElement('button')
            selectBtn.value = shiftObj.shift._id
            selectBtn.textContent = 'Select'
            selectBtn.onclick = () => displayShift(shiftObj.shift._id)
            selectCell.appendChild(selectBtn)
            tableBody.appendChild(document.createElement('br'))
    
        })
    } else {
        window.location.href = './login.html'
    }

}

async function displayShift(shiftID) {
    console.log('display shift selected')
    const response = await fetch(`http://127.0.0.1:8000/shifts/byID/${shiftID}` , {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'count-action':'false',
            'accessToken': `${sessionStorage['accessToken']}`
        }
    })
    if (response.ok) {
        const myShift = await response.json()
        const allEmpsData = await fetch('http://127.0.0.1:8000/team/getAll' , {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'count-action':'false',
                'accessToken': `${sessionStorage['accessToken']}`
            }
        })
        const allEmployees = await allEmpsData.json()
    
        const availableEmps = allEmployees.filter(emp=>!myShift.assignedTo.includes(emp.employee._id))
        const myEmployees = allEmployees.filter(emp=>myShift.assignedTo.includes(emp.employee._id))
    
        const shiftContainer = document.getElementById('shiftContainer')
        shiftContainer.innerHTML = ''
    
        const myShiftID = document.createElement('p')
        myShiftID.id = 'myShiftID'
        myShiftID.textContent = myShift._id
        myShiftID.hidden = true
        shiftContainer.appendChild(myShiftID)
    
        const form = document.createElement('form')
        form.id = 'editShiftForm'
    
        // Create input for date
        const dateInput = document.createElement('input')
        dateInput.id = 'editShiftDate'
        dateInput.type = 'date'
        dateInput.name = 'date'
        dateInput.value = new Date(myShift.date).toISOString().split('T')[0]
        form.appendChild(dateInput)
    
        // Create select for starting hour
        const startHourSelect = document.createElement('select')
        startHourSelect.id = 'editStartingHour'
        startHourSelect.name = 'editStartingHour'
        
        // Options for starting hour
        const startingHours = [8, 9, 10, 11, 12] 
        startingHours.forEach(hour => {
            const option = document.createElement('option')
            option.value = hour
            option.textContent = `${hour}:00`
            startHourSelect.appendChild(option)
        });
        startHourSelect.value = myShift.startingHour 
        form.appendChild(startHourSelect)
    
        // Create select for ending hour
        const endHourSelect = document.createElement('select')
        endHourSelect.id = 'editEndingHour'
        endHourSelect.name = 'editEndingHour'
        
        // Options for ending hour
        const endingHours = [15, 16, 17, 18, 19]
        endingHours.forEach(hour => {
            const option = document.createElement('option')
            option.value = hour
            option.textContent = `${hour}:00`
            endHourSelect.appendChild(option)
        })
        endHourSelect.value = myShift.endingHour
        form.appendChild(endHourSelect)
    
        // Create a submit button
        const submitButton = document.createElement('button')
        submitButton.type = 'submit'
        submitButton.textContent = 'edit shift'
        form.appendChild(submitButton)
    
        shiftContainer.appendChild(form)
    
        // create the dropdowns
    
        const onShiftEmps = document.createElement('select')
        onShiftEmps.id = 'onShiftEmps'
        myEmployees.forEach(emp => {
            const option = document.createElement('option')
            option.value = emp.employee._id
            option.textContent = `${emp.employee.firstName} ${emp.employee.lastName}`
            onShiftEmps.appendChild(option)
        })
    
        shiftContainer.appendChild(onShiftEmps)
    
        const removeEmpBtn = document.createElement('button')
        removeEmpBtn.onclick = () => unassignFromShift(myShift._id, onShiftEmps.value)
        removeEmpBtn.textContent = 'Remove from shift'
    
        shiftContainer.appendChild(removeEmpBtn)
    
        const offShiftEmps = document.createElement('select')
        offShiftEmps.id = 'offShiftEmps'
        availableEmps.forEach(emp => {
            const option = document.createElement('option')
            option.value = emp.employee._id
            option.textContent = `${emp.employee.firstName} ${emp.employee.lastName}`
            offShiftEmps.appendChild(option)
        })
        shiftContainer.appendChild(document.createElement('br'))
        shiftContainer.appendChild(offShiftEmps)
    
        const addEmpBtn = document.createElement('button')
        addEmpBtn.onclick = () => assignToShift(myShift._id, offShiftEmps.value)
        addEmpBtn.textContent = 'Add to shift'
    
        shiftContainer.appendChild(addEmpBtn)
    
        document.getElementById('editShiftForm').addEventListener('submit', function(event) {
            event.preventDefault();
            editShift()
        })
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
        loadShiftsPage()
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
    if(response.ok) {
        const data = await response.json()
        console.log(data)
        loadShiftsPage()
        const messages = document.getElementById('messages')
        messages.innerHTML = ''
        const message = document.createElement('div')
        message.textContent = data.message
        messages.appendChild(message)
    } else {
        window.location.href = './login.html'
    }

}

async function createShift() {
    const shiftDate = document.getElementById('shiftDate').value
    const startingHour = document.getElementById('startingHour').value
    const endingHour = document.getElementById('endingHour').value

    const response = await fetch('http://127.0.0.1:8000/shifts/create', {
        method:'POST',
        headers:{
            'content-Type':'application/json',
            'count-action':'false',
            'accessToken': `${sessionStorage['accessToken']}`
        },
        body:JSON.stringify({
            date:shiftDate,
            startingHour,
            endingHour
        })
    })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
        loadShiftsPage()
        const messages = document.getElementById('messages')
        messages.innerHTML = ''
        const message = document.createElement('div')
        message.textContent = data.message
        messages.appendChild(message)
    } else {
        window.location.href = './login.html'
    }

}

async function editShift() {
    const myShiftID = document.getElementById('myShiftID').textContent
    const shiftDate = document.getElementById('editShiftDate').value
    const startingHour = document.getElementById('editStartingHour').value
    const endingHour = document.getElementById('editEndingHour').value

    const response = await fetch('http://127.0.0.1:8000/shifts/update', {
        method:'PATCH',
        headers:{
            'content-Type':'application/json',
            'count-action':'true',
            'accessToken': `${sessionStorage['accessToken']}`
        },
        body:JSON.stringify({
            id:myShiftID,
            date:shiftDate,
            startingHour,
            endingHour
        })
    })
    if(response.ok) {
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