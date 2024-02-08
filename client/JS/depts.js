//load dept page
async function loadDeptPage() {
    const response = await fetch('/dept/allData' , {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'count-action':'true',
            'accessToken': `${sessionStorage['accessToken']}`
        }
    })
    if (response.ok) {
        const allDepts= await response.json()
        const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0]
    
        //create depts data rows
        allDepts.forEach(dept=>{
            //create row
            const newRow = tableBody.insertRow()
            
            const editDeptLink = document.createElement('a')
            editDeptLink.href = `editDepts.html?id=${dept.department._id}`
            editDeptLink.textContent = `${dept.department.name}`
            newRow.insertCell(0).appendChild(editDeptLink)
    
            newRow.insertCell(1).textContent = ` ${dept.manager.firstName?dept.manager.firstName:'Not'} ${dept.manager.lastName?dept.manager.lastName:'Assigned'} `
    
            const empCell = newRow.insertCell(2)
            for (const emp of dept.employees) {
                const editEmployeeLink = document.createElement('a')
                editEmployeeLink.href = `editEmployees.html?id=${emp._id}`
                editEmployeeLink.textContent = ` ${emp.firstName} ${emp.lastName} `
                empCell.appendChild(editEmployeeLink)
                empCell.appendChild(document.createElement('br'))
            }
    
            tableBody.appendChild(newRow)
            tableBody.appendChild(document.createElement('br'))
    
        })
    } else {
        window.location.href = './login.html'
    }

}

// add all employees to the dropdown menu
async function populateAllEmpDropDown() {
    const response = await fetch(`/team/getAllEmployees` , {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'count-action':'false',
            'accessToken': `${sessionStorage['accessToken']}`
        }
    })
    const allEmployees= await response.json()
    const empSelector = document.getElementById('empSelector')
    empSelector.innerHTML = ''
    allEmployees.forEach(emp=>{
        const dropDownOption = document.createElement('option')
        dropDownOption.value = emp.employee._id
        dropDownOption.textContent = `${emp.employee.firstName} ${emp.employee.lastName}`
        empSelector.appendChild(dropDownOption)
    })
}

// add unassigned employees to the dropdown menu
async function populateEmpDropDown(deptID) {
    const response = await fetch(`/team/unassignedByDeptID/${deptID}` , {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'count-action':'false',
            'accessToken': `${sessionStorage['accessToken']}`
        }
    })
    const allEmployees= await response.json()
    const empSelector = document.getElementById('empSelector')
    empSelector.innerHTML = ''
    allEmployees.forEach(emp=>{
        const dropDownOption = document.createElement('option')
        dropDownOption.value = emp._id
        dropDownOption.textContent = `${emp.firstName} ${emp.lastName}`
        empSelector.appendChild(dropDownOption)
    })
}

// add departments to the dropdown menu
async function populateManagerDropDown(deptID) {
    const response = await fetch(`/team/byDeptID/${deptID}` , {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'count-action':'false',
            'accessToken': `${sessionStorage['accessToken']}`
        }
    })
    const allEmployees= await response.json()
    const managerSelector = document.getElementById('managerSelector')
    managerSelector.innerHTML = ''
    const defualtDropDownOption = document.createElement('option')
    defualtDropDownOption.value = "none"
    defualtDropDownOption.textContent = "None"
    managerSelector.appendChild(defualtDropDownOption)
    allEmployees.forEach(emp=>{
        const dropDownOption = document.createElement('option')
        dropDownOption.value = emp._id
        dropDownOption.textContent = `${emp.firstName} ${emp.lastName}`
        managerSelector.appendChild(dropDownOption)
    })

}


//add department
async function addDept() {
    const deptName = document.getElementById('deptName').value
    const newDept = {
        name:deptName
    }
    console.log(newDept)
    const response = await fetch('/dept/create', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'count-action':'true',
            'accessToken': `${sessionStorage['accessToken']}`
        },
        body:JSON.stringify(newDept)
    })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
    
        const messages = document.getElementById('messages')
        messages.innerHTML = ''
        const message = document.createElement('div')
        message.textContent = data.message
        messages.appendChild(message)
        window.location.href = 'departments.html'
    } else {
        window.location.href = './login.html'
    }


}


async function loadEditDeptPage() {

    // get the employee data
    const currentURL = new URL(window.location.href)
    const deptID = currentURL.searchParams.get('id')
    const response = await fetch(`/dept/byID/${deptID}` , {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'count-action':'true',
            'accessToken': `${sessionStorage['accessToken']}`
        }
    })
    if (response.ok) {
        const deptData = await response.json()
        console.log(deptData)
        document.getElementById('deptID').textContent = deptData._id
        document.getElementById('deptName').value = deptData.name
    
        // populate the emp and manager dropdown
        await populateEmpDropDown(deptData._id)
        await populateManagerDropDown(deptData._id)
    
        const managerSelector = document.getElementById('managerSelector')
        managerSelector.value = deptData.manager
    } else {
        window.location.href = './login.html'
    }


}

async function assignToDept() {
    const deptID = document.getElementById('deptID').textContent
    const employeeID = document.getElementById('empSelector').value
    const response = await fetch('/team/update', {
        method:'PATCH',
        headers:{
            'content-Type':'application/json',
            'count-action':'false',
            'accessToken': `${sessionStorage['accessToken']}`
        },
        body:JSON.stringify({
            _id:employeeID,
            deptID:deptID
            
        })
    })
    if (response.ok) {
        const data = await response.json()
        loadEditDeptPage()
        const messages = document.getElementById('messages')
        messages.innerHTML = ''
        const message = document.createElement('div')
        message.textContent = data.message
        messages.appendChild(message)
    } else {
        window.location.href = './login.html'
    }

}

async function editDept() {
    const deptName = document.getElementById('deptName').value
    const managerID = document.getElementById('managerSelector').value
    const deptID = document.getElementById('deptID').textContent
    const updatedDept = {
        _id:deptID,
        name:deptName,
        manager:managerID !== 'none'? managerID : null,
    }
    console.log(updatedDept)
    const response = await fetch('/dept/update', {
        method:'PATCH',
        headers:{
            'Content-Type':'application/json',
            'count-action':'false',
            'accessToken': `${sessionStorage['accessToken']}`
        },
        body:JSON.stringify(updatedDept)
    })
    if (response.ok) {
        const data = await response.json()
        console.log(data)
        loadEditDeptPage()
        const messages = document.getElementById('messages')
        messages.innerHTML = ''
        const message = document.createElement('div')
        message.textContent = data.message
        messages.appendChild(message)
    } else {
        window.location.href = './login.html'
    }

}

async function deleteDept() {
    const deptID = document.getElementById('deptID').textContent
    const response = await fetch(`/dept/delete/${deptID}`, {
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
    } else {
        window.location.href = './login.html'
    }

}