import { NowRequest, NowResponse } from '@now/node'
import rp from 'request-promise'
import $ from 'cheerio'

import { connectToDatabase } from '../utils/db'

module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
	const { word } = req.query

	if (!word) {
		res.status(400).send('Query as "word" is empty')
	}

	try {
		const db = await connectToDatabase(process.env.MONGODB_URI)
		const collection = await db.collection('conjugation')

		const html = await rp(`https://www.babla.ru/${encodeURI('спряжения')}/${encodeURI('польский')}/${encodeURI(String(word))}`)

		const presentTimeBlock = $('#conjFull .conj-tense-block', html).first()
		const pastTimeBlock = $('#conjFull .conj-tense-block', html).eq(1)

		const listOfItemElementsPresent = $('.conj-item', presentTimeBlock)
		const listOfPersonElementsPresent = $('.conj-person', presentTimeBlock)
		const listOfResultElementsPresent = $('.conj-result', presentTimeBlock)

		const listOfItemElementsPast = $('.conj-item', pastTimeBlock)
		const listOfPersonElementsPast = $('.conj-person', pastTimeBlock)
		const listOfResultElementsPast = $('.conj-result', pastTimeBlock)

		const conjugationPresent = {}
		const conjugationPast = {}

		for (let i = 0; i < listOfItemElementsPresent.length; i++) {
			conjugationPresent[listOfPersonElementsPresent.eq(i).text()] = listOfResultElementsPresent.eq(i).text()
		}

		for (let i = 0; i < listOfItemElementsPast.length; i++) {
			conjugationPast[listOfPersonElementsPast.eq(i).text()] = listOfResultElementsPast.eq(i).text()
		}

		await collection.insert({
			word,
			present: conjugationPresent,
			past: conjugationPast,
		})

		const conjugation = await collection.find({}).toArray()

		res.json(conjugation)

	} catch (error) {
		res.status(500).send(error)
	}
}