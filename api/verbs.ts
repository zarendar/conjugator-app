import { NowRequest, NowResponse } from '@now/node'
import { connectToDatabase } from '../utils/db'

module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
	const db = await connectToDatabase(process.env.MONGODB_URI)
	const collection = await db.collection('verbs')
	const verbs = await collection.find({}).toArray()

	res.status(200).json({ verbs })
}