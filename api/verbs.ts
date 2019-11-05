import { NowRequest, NowResponse } from '@now/node'

import {PAGINATION_LIMIT} from '../constants'
import { connectToDatabase } from '../utils/db'

module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
	try {
		const {page = 1, search = ''} = req.query
		const skips = PAGINATION_LIMIT * (Number(page) - 1)

		const db = await connectToDatabase(process.env.MONGODB_URI)
		const collection = await db.collection('verbs')
		const verbs = await collection
			.find({ word: { $regex: `^${String(search).toLowerCase()}` } })
			.skip(skips)
			.limit(PAGINATION_LIMIT)
			.sort({word: 1})
			.toArray()

		res.status(200).json({ verbs })
	} catch (error) {
		res.status(500).send(error)
	}
}