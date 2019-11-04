import { NowRequest, NowResponse } from '@now/node'
import {connectToDatabase} from '../utils/db'

module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
	try {
		const db = await connectToDatabase(process.env.MONGODB_URI)
		const collection = await db.collection('progress')
		await collection.findOneAndUpdate(
			{ username: req.cookies.token },
			{$set: req.body},
		)

		res.status(200).json({ status: 'ok' })
	} catch (error) {
		res.status(500).json({error})
	}
}