if (!Array.prototype.last) Array.prototype.last = function() {return this[this.length - 1]};

const express = require('express')
	, app = express()
	, auth = require('./controllers/auth')
	, codes = require('./controllers/codes')
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

app
	.use(require('cors')(require('./controllers/cors')))
	.use(express.json())
	.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.json({ status: 'I work!' }));

app.get('/sync', auth.checkAuth, codes.sync);

app.post('/registration', auth.registration);

app.post('/scan', auth.checkAuth, codes.scan);

app.post('/check', auth.checkAuth, codes.check);

app.listen(process.env.PORT || 8080, () => console.log('Listen on :', process.env.PORT || 8080));