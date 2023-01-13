const {users, saveUsers} = require("../utils/users");
const routes = require('../models/routes');
const longpull = { 'Единороги': [], 'Земнопони': [], 'Пегасы': [], admin: [] };

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
				'Единороги': { ...users['Единороги'], hash: undefined, attempt: undefined },
				'Земнопони': { ...users['Земнопони'], hash: undefined, attempt: undefined },
				'Пегасы': { ...users['Пегасы'], hash: undefined, attempt: undefined }
			}
		});
	},

	subscribe({ user }, res) {
		longpull[user].push(res);
	},

	check({ user, body: { index, answer } }, res) {
		if (index !== users[user].point) return res.json({ status: 'wrongIndex' });
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

		res.json({status: isAnswer ? 'OK' : 'error'});
		const longpullUsers = [...longpull[user]];
		longpull[user] = [];
		while (longpullUsers.length) {
			const resLong = longpullUsers.pop();
			resLong.json({status: isAnswer ? 'OK' : 'error', point: {...routes[user][users[user].point], answer: undefined}});
		}
		const longpullAdmins = [...longpull.admin];
		longpull.admin = [];
		while (longpullAdmins.length) {
			const resLong = longpullAdmins.pop();
			resLong.json({status: 'OK', user: { ...users[user], hash: undefined, attempt: undefined }});
		}
	}
}
