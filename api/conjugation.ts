import { NowRequest, NowResponse } from '@now/node'
import {connectToDatabase} from '../utils/db'


module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
	try {
		const {word} = req.query
		const db = await connectToDatabase(process.env.MONGODB_URI)
		const collection = await db.collection('conjugation')
		const [conjugation] = await collection.find({word}).toArray()

		res.status(200).json({ conjugation })
	} catch (error) {
		res.status(500).json({error})
	}
}
