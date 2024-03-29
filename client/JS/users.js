
//load users page
async function loadUsersPage() {
    const response = await fetch('/users/getAll' , {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'count-action':'true',
            'accessToken': `${sessionStorage['accessToken']}`
        }
    })
    if (response.ok) {
        const allUsers= await response.json()

        const tableBody = document.getElementById('usersTable').getElementsByTagName('tbody')[0]
        tableBody.innerHTML = ''
    
        allUsers.forEach(userObj=>{
            //create row
            const newRow = tableBody.insertRow()
    
            newRow.insertCell(0).textContent = userObj.user.customID
            newRow.insertCell(1).textContent = userObj.user.name
            newRow.insertCell(2).textContent = userObj.actionsLeft.maxActions
            newRow.insertCell(3).textContent = userObj.actionsLeft.actionsLeft
        })
    } else {
        window.location.href = './login.html'
    }

}


async function login() {
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const myData = {
        username:username,
        email:email
    }
    const response = await fetch('/users/login', {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify(myData)
    })
    if (response.ok) {
        const userData= await response.json()
        if (userData.message) {
            const messages = document.getElementById('messages')
            messages.innerHTML = ''
            const message = document.createElement('div')
            message.textContent = userData.message
            messages.appendChild(message)
        } else {
            sessionStorage['userName'] = userData.name
            sessionStorage['customID'] = userData.customID
            sessionStorage['accessToken'] = userData.accessToken
            window.location.href = 'employees.html'
            console.log(userData)
            console.log(sessionStorage['userName'])
        }
    } else {
        const messages = document.getElementById('messages')
        messages.innerHTML = ''
        const message = document.createElement('div')
        message.textContent = "can not log in"
        messages.appendChild(userData.message)
    }

}

function clearSession() {
    sessionStorage.clear();
    console.log('Session storage cleared.');
}