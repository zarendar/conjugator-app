import { NowRequest, NowResponse } from '@now/node'
import { connectToDatabase } from '../utils/db'

module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
	try {
		const db = await connectToDatabase(process.env.MONGODB_URI)
		const collection = await db.collection('verbs')
		const verbsCount = await collection.count()

		res.status(200).json({ verbsCount })
	} catch (error) {
		res.status(500).send(error)
	}
}