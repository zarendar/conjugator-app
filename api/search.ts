import { NowRequest, NowResponse } from '@now/node'
import rp from 'request-promise';

const createOptions = (search: string | string[]) => ({
	method: 'POST',
	uri: 'https://en.bab.la/ax/conjugation/getVerbs',
	form: {
		v: search,
		l: 'pl',
	},
})

module.exports = (req: NowRequest, res: NowResponse) => {
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
