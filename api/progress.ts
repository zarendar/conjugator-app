import { NowRequest, NowResponse } from '@now/node'
import {connectToDatabase} from '../utils/db'

module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
	try {
		const db = await connectToDatabase(process.env.MONGODB_URI)
		const collection = await db.collection('progress')
		const progress = await collection.find({username: req.query.username}).toArray()

		res.status(200).json({ progress: progress[0] })
	} catch (error) {
		res.status(500).json({error})
	}
}