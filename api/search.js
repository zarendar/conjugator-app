// @flow
const rp = require('request-promise')

const createOptions = search => ({
	method: 'POST',
	uri: 'https://en.bab.la/ax/conjugation/getVerbs',
	form: {
		v: search,
		l: 'pl',
	},
})

module.exports = (req, res) => {
	rp(createOptions(req.query.q))
		.then(function(parsedBody) {
			const array = JSON.parse(parsedBody)
			const result = array.map(item => decodeURI(item.value))
			res.json(result)
		})
		.catch(function(err) {
			res.json(err)
		})
}
