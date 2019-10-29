import { NowRequest, NowResponse } from '@now/node'
import rp from 'request-promise'
import $ from 'cheerio'

module.exports = (_req: NowRequest, res: NowResponse): void => {
	rp('https://www.tastingpoland.com/language/verb/verb_infinitives.html')
		.then((html) => {
			const top = []
			const pills = $('.pills a', html)

			for (let i = 0; i < pills.length; i++) {
				top.push(pills.eq(i).text())
			}

			res.send(top)
		})
		.catch(() => {
			res.status(500).send('Internal Server Error')
		})
}
