const express = require('express')
	, app = express()
	, users = require('./users.json')
	, questions = require('./questions')
	, { writeFile } = require('fs')
	, saveUsers = () => {writeFile('./users.json',  JSON.stringify(users), 'utf8', () => {});}
;

/*
GET /sync

POST /registration
Body:
	nickname

POST /scan
Body:
	code

POST /check
Body:
	code
	answer
 */

app.get('/', (req, res) => res.json({ status: 'I work!' }));

app.get('/sync', (req, res) => {
	res.end();
});

app.post('/registration', (req, res) => {
	res.end();
});

app.post('/scan', (req, res) => {
	res.end();
});

app.post('/check', (req, res) => {
	res.end();
});

app.listen(process.env.PORT || 8081, () => console.log('Listen on :', process.env.PORT || 8081));