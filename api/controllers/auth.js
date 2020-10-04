const { users, saveUsers } = require('../utils/users')
	, random = require('../utils/random')
;

module.exports = {
	checkAuth(req, res, next) {
		const { headers: { authorization = '' } } = req;

		let username = Buffer.from(authorization.slice(6), 'base64').toString().split(':');
		username.pop();
		username = username.join(':');

		if (!users[username] || authorization !== 'Basic ' + Buffer.from(username+':'+users[username].hash).toString('base64')) {
			res.json({status: 'authError'});
			return;
		}

		req.user = username;
		next();
	},

	registration({ body: { username } }, res) {
		if (!username || users.hasOwnProperty(username)) {
			res.json({status: 'error'});
			return;
		}

		users[username] = {
			hash: random(10),
			all: 0,
			complete: [],
			failed: [],
			codes: {},
			tasks: [],
			timestamps: []
		};

		saveUsers();

		res.json({status: 'OK', hash: users[username].hash});
	}
}