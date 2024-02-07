const actionsJson = '../factory_project/server/data/actions.json'

const jFile = require('jsonfile')

const getAll = () => {
    return jFile.readFile(actionsJson)
}

const writeAll = (updatedJson) => {
    return jFile.writeFile(actionsJson, updatedJson, { spaces: 2 })
}

module.exports = {
    getAll, 
    writeAll
}