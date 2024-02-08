const usersRepo = require('../repositories/usersRepo')
const authRepo = require('../repositories/authRepo')
const actionsRepo = require('../repositories/actionsRepo')
const jwt = require("jsonwebtoken")

const getAll = async () => {
    try {
        const allUsers = await usersRepo.getAll()
        const integratedData =[]
        for (const user of allUsers) {
            const userObject = user.toObject()
            const dailyActionsLeft = await getActionsLeft(userObject.customID)
            const myData = {
            user:userObject,
            actionsLeft:dailyActionsLeft
        }
        integratedData.push(myData)
        }
    
        return integratedData
    } catch (error) {
        console.log("An error occurred:", error)
        return []
    }

}

const getByID = (userID) => {
    return usersRepo.getByID(userID)
}

const getByCustomID = (customUserID) => {
    return usersRepo.getByCustomID(customUserID)
}

const createUser = (userData) => {
    return usersRepo.createUser(userData)
}

const updateUser = (userID, userData) => {
    return usersRepo.updateUser(userID, userData)
}

const deleteUser = (userID) => {
    return usersRepo.deleteUser(userID)
}

const getActionsLeft = async (userCustomID) => {
    let actionsLeft
    let maxActions
    try {
        actionsFile = await actionsRepo.getAll()
        console.log(actionsFile)
        console.log(userCustomID)
        const myUser = await usersRepo.getByCustomID(userCustomID)
        console.log(myUser) 
        maxActions = myUser.numOfActions
        const today = new Date().toLocaleDateString()
        const userActionsToday = actionsFile.actions.filter(action => action.id===userCustomID && action.date === today)
        console.log(userActionsToday.length) 
        const actionsLeft = maxActions - userActionsToday.length
        console.log(actionsLeft) 
        return { actionsLeft, maxActions }
    } catch (error) {
        console.log("An error occurred:", error)
        return { actionsLeft, maxActions }
    }
 

}


const addAction = async (userCustomID, actionsLeft, maxActions) => {

    console.log('adding action')
    const actionsFile = await actionsRepo.getAll()
    const today = new Date().toLocaleDateString()
    const newAction = {
        id: userCustomID,
        maxActions: maxActions,
        date:today,
        actionAllowed: actionsLeft - 1
    }
    console.log(newAction)
    actionsFile.actions.push(newAction)
    return actionsRepo.writeAll(actionsFile)



}

const login = async(username, email) => {
    try{
        const response = await authRepo.getAll()
        const allCredentials = await response.json()
        const myUser = allCredentials.find(user=>user.username === username)
        console.log(myUser)
        if ( myUser && myUser.email=== email) {
            const myCustomUser = await getByCustomID(myUser.id)
            const secretKey = process.env.SECRET_KEY || "secret"
            const token = jwt.sign({myCustomUser}, secretKey )
            console.log(myCustomUser)
            const userData = {
                customID : myCustomUser.customID,
                name:myCustomUser.name,
                accessToken : token
            }
            return userData
        } else {
            return {message:'wrong credentials'}
        } 
    } catch (error) {
        console.log('an error occured', error)
        return {message:'could not login'}
    }


}


const validateAction = async (req, res, next) => {
    try{
        const accessToken = req.headers["accesstoken"]
        const countAction = req.headers['count-action']
        const secertKey = process.env.SECRET_KEY || "secret"
        const {myCustomUser} = jwt.verify(accessToken, secertKey)
        console.log(myCustomUser)
        if (countAction==='true') {
            const { actionsLeft, maxActions } = await getActionsLeft(myCustomUser.customID)
            if (actionsLeft>0) {
                addAction(myCustomUser.customID, actionsLeft, maxActions)
                    .then(()=>next())
                    .catch(err=>{console.log(err)})
            } else {
                return res.status(401).send({message:'no actions left today!'})
            }
        } else {
            next()
        }

    } catch (err) {
        console.log(err)
        return res.status(401).send({message:'invalid'})
    }

}

module.exports = {
    getAll, 
    getByID, 
    getByCustomID, 
    createUser, 
    updateUser, 
    deleteUser,
    login,
    validateAction,
    getActionsLeft
}