const {users, saveUsers} = require("../utils/users");
const routes = require('../models/routes');
const longpull = { team1: [], team2: [], team3: [], admin: [] };

module.exports = {
	init({ user }, res) {
		res.json({
			status: 'OK',
			all: routes[user].length,
			complete: users[user].complete,
			failed: users[user].failed,
			points: routes[user].slice(0, users[user].point + 1).map(e => ({ ...e, answer: undefined})),
		});
	},

	admin({ user }, res) {
		if (user !== 'admin') res.json({ status: 'error' });
		res.json({
			status: 'OK',
			routes,
			users: {
				team1: { ...users.team1, hash: undefined, attempt: undefined },
				team2: { ...users.team2, hash: undefined, attempt: undefined },
				team3: { ...users.team3, hash: undefined, attempt: undefined }
			}
		});
	},

	subscribe({ user }, res) {
		longpull[user].push(res);
	},

	check({ user, body: { answer } }, res) {
		const question = routes[user][users[user].point];
		const isAnswer = (question.answer instanceof RegExp && question.answer.test(answer)) || question.answer === answer

		if (!isAnswer) {
			if (!users[user].answers[users[user].point]) users[user].answers[users[user].point] = [];
			users[user].answers[users[user].point].push(answer);

			if (users[user].attempt < 2) {
				users[user].attempt++;
				saveUsers()
				res.json({status: 'error'});
				return;
			}
		}

		users[user].timestamps.push(Date.now());
		users[user][isAnswer ? 'complete' : 'failed'].push(users[user].point);
		if (isAnswer) delete users[user].answers[users[user].point]
		users[user].point++;
		users[user].attempt = 0;
		saveUsers()

		res.end();
		while (longpull[user].length) {
			const resLong = longpull[user].pop();
			resLong.json({status: isAnswer ? 'OK' : 'error', point: {...routes[user][users[user].point], answer: undefined}});
		}
		while (longpull.admin.length) {
			const resLong = longpull.admin.pop();
			resLong.json({status: 'OK', user: { ...users[user], hash: undefined, attempt: undefined }});
		}
	}
}
