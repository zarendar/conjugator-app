import { NowRequest, NowResponse } from '@now/node'
import { connectToDatabase } from '../utils/db'

const LIMIT = 8

module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
	try {
		const skips = LIMIT * (Number(req.query.page) - 1)

		const db = await connectToDatabase(process.env.MONGODB_URI)
		const collection = await db.collection('verbs')
		const verbs = await collection.find({}).skip(skips).limit(LIMIT).toArray()

		res.status(200).json({ verbs })
	} catch (error) {
		res.status(500).send(error)
	}
}