import { NowRequest, NowResponse } from '@now/node'
// import {connectToDatabase} from '../utils/db'

// module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
// 	const db = await connectToDatabase(process.env.MONGODB_URI)
// 	const collection = await db.collection('users')
// 	const users = await collection.find({username: req.query.username}).toArray()

// 	res.status(200).json({ user: users[0] })
// }
import createUserModel from '../models/user'

module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
	try {
		const { username, password } = req.body
		const User = await createUserModel(process.env.MONGODB_URI)
		const user = await User.findByCredentials(username, password)

		if (!user) {
			res.status(401).json({error: 'Logowanie nie powiodło się!'})
			return
		}


		const token = await user.generateAuthToken()
		res.send({ user, token })
	} catch (error) {
		res.status(400).json({error})
	}
}