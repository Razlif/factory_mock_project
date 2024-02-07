const authURL = 'https://jsonplaceholder.typicode.com/users'

const getAll = () => {
    return fetch(authURL)
}

module.exports = {
    getAll
}