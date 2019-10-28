import { NowRequest, NowResponse } from '@now/node'
import rp from 'request-promise'
import $ from 'cheerio';


module.exports = (req: NowRequest, res: NowResponse) => {
	rp(`https://www.babla.ru/${encodeURI('спряжения')}/${encodeURI('польский')}/${encodeURI(String(req.query.q))}`)
		.then(function(html){
			const presentTimeBlock = $('#conjFull .conj-tense-block', html).first()
			const translateItemElements = $('#conjTrans .quick-result-overview a', html)

			const listOfItemElements = $('.conj-item', presentTimeBlock)
			const listOfPersonElements = $('.conj-person', presentTimeBlock)
			const listOfResultElements = $('.conj-result', presentTimeBlock)

			const conjugation = {}
			let translate = ''

			for (let i = 0; i < listOfItemElements.length; i++) {
				conjugation[listOfPersonElements.eq(i).text()] = listOfResultElements.eq(i).text()
			}

			for (let i = 0; i < translateItemElements.length; i++) {
				translate += translateItemElements.eq(i).text()
				if (i < (translateItemElements.length - 1)) {
					translate += ', '
				}
			}

			res.json({
				conjugation,
				translate
			})
		})
		.catch(function (err) {
			console.log(err)
		})
}
