import { NowRequest, NowResponse } from '@now/node'
import {connectToDatabase} from '../utils/db'

module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
	const db = await connectToDatabase(process.env.MONGODB_URI)
	const collection = await db.collection('users')
	const users = await collection.find({username: req.query.username}).toArray()

	res.status(200).json({ user: users[0] })
}