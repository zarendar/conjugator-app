import { NowRequest, NowResponse } from '@now/node'
import rp from 'request-promise'
import $ from 'cheerio'


module.exports = (req: NowRequest, res: NowResponse): void => {
	rp(`https://www.babla.ru/${encodeURI('спряжения')}/${encodeURI('польский')}/${encodeURI(String(req.query.q))}`)
		.then(function (html) {
			const translateItemElements = $('#conjTrans .quick-result-overview a', html)
			const presentTimeBlock = $('#conjFull .conj-tense-block', html).first()
			const pastTimeBlock = $('#conjFull .conj-tense-block', html).eq(1)

			const listOfItemElementsPresent = $('.conj-item', presentTimeBlock)
			const listOfPersonElementsPresent = $('.conj-person', presentTimeBlock)
			const listOfResultElementsPresent = $('.conj-result', presentTimeBlock)

			const listOfItemElementsPast = $('.conj-item', pastTimeBlock)
			const listOfPersonElementsPast = $('.conj-person', pastTimeBlock)
			const listOfResultElementsPast = $('.conj-result', pastTimeBlock)


			let translate = ''
			const conjugationPresent = {}
			const conjugationPast = {}

			for (let i = 0; i < listOfItemElementsPresent.length; i++) {
				conjugationPresent[listOfPersonElementsPresent.eq(i).text()] = listOfResultElementsPresent.eq(i).text()
			}

			for (let i = 0; i < listOfItemElementsPast.length; i++) {
				conjugationPast[listOfPersonElementsPast.eq(i).text()] = listOfResultElementsPast.eq(i).text()
			}

			for (let i = 0; i < translateItemElements.length; i++) {
				translate += translateItemElements.eq(i).text()
				if (i < (translateItemElements.length - 1)) {
					translate += ', '
				}
			}

			res.json({
				translate,
				conjugationPresent,
				conjugationPast,
			})
		})
		.catch(function (err) {
			console.log(err)
		})
}
