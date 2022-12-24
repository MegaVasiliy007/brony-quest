if (!Array.prototype.last) Array.prototype.last = function() {return this[this.length - 1]};

const express = require('express')
	, app = express()
	, auth = require('./controllers/auth')
	, codes = require('./controllers/codes')
	, town = require('./controllers/town')
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

const router = express.Router();
router.use(auth.checkAuth);
router.get('/init', town.init);
router.get('/admin', town.admin);
router.post('/check', town.check);
router.get('/subscribe', town.subscribe);

app.use('/town', router);

app.listen(process.env.PORT || 8080, () => console.log('Listen on :', process.env.PORT || 8080));
