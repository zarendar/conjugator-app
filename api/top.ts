import { NowRequest, NowResponse } from '@now/node'
import rp from 'request-promise'
import $ from 'cheerio';

module.exports = (req: NowRequest, res: NowResponse) => {
	rp('https://www.tastingpoland.com/language/verb/verb_infinitives.html')
    .then(function (html) {
      const top = [];
      const pills = $('.pills a', html);

      for (let i = 0; i < pills.length; i++) {
        top.push(pills.eq(i).text());
			}

			res.send(top)
		})
		.catch(function (err) {
			res.status(500).send('Internal Server Error')
		})
}
