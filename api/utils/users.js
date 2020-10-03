const { writeFile } = require('fs');

module.exports = {
	users: require('../models/users.json'),
	saveUsers() {writeFile('./models/users.json',  JSON.stringify(module.exports.users), 'utf8', () => {});}
};