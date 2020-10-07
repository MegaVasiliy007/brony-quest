const { users, saveUsers } = require('../utils/users')
	, questions = require('../models/questions')
	, codes = require('../models/codes')
;

module.exports = {
	sync({ user }, res) {
		res.json({ status: 'OK', tasks: { all: users[user].all, complete: users[user].complete, failed: users[user].failed } });
	},

	scan({ user, body: { hash } }, res) {
		if (!codes.find(el => el === hash) || users[user].codes[hash] === 'SECOND' || users[user].codes[hash] === 'DONE' || users[user].codes[hash] === 'FAIL') {
			res.json({status: 'error'});
			return;
		}

		users[user].codes[hash] = users[user].codes[hash] === 'FIRST' ? 'SECOND' : 'FIRST';
		users[user].timestamps.push(Date.now());

		let questionIndex;
		do {
			questionIndex = Math.floor(Math.random() * questions.length);
		} while (users[user].tasks.find(el => el === questionIndex));

		users[user].tasks.push(questionIndex);
		saveUsers();

		const question = {...questions[questionIndex]};
		delete question.answer;
		res.json({ status: 'OK', question });
	},

	check({ user, body: { hash, answer } }, res) {
		console.log(user, hash, answer);
		if (!users[user].codes.hasOwnProperty(hash)) {
			res.json({status: 'error'});
			return;
		}

		console.log(users[user].tasks);

		const question = questions[users[user].tasks.last()];

		console.log(question);

		if (question.answer !== answer) {
			if (users[user].codes[hash] === 'SECOND') {users[user].codes[hash] = 'FAIL'; users[user].failed.push(users[user].all++);}
			saveUsers();
			res.json({status: 'error'});
			return;
		}

		users[user].codes[hash] = 'DONE';
		users[user].complete.push(users[user].all++);
		saveUsers();
		res.json({ status: 'OK' });
	}
}