const { users, saveUsers } = require('../utils/users')
	, questions = require('../models/questions')
	, codes = require('../models/codes')
	, names = ['Fluttershy', 'Rarity', 'Pinkie Pie', 'Rainbow Dash', 'Twilight Sparkle', 'Applejack', 'Spike', 'Princess Celestia', 'Princess Luna', 'Princess Cadance']
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

		questionIndex = 3;

		users[user].tasks.push(questionIndex);

		const question = {...questions[questionIndex]};
		if (!question.answer) {
			users[user].codes[hash] = 'DONE';
			users[user].complete.push(users[user].all++);
		}

		delete question.answer;

		question.character = names[users[user].all];

		saveUsers();
		res.json({ status: 'OK', question });
	},

	check({ user, body: { hash, answer } }, res) {
		if (!users[user].codes.hasOwnProperty(hash)) {
			res.json({status: 'error'});
			return;
		}

		const question = questions[users[user].tasks.last()];

		if ((question.answer instanceof RegExp && !question.answer.test(answer)) || question.answer !== answer) {
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