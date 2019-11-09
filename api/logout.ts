import { NowRequest, NowResponse } from '@now/node'
import jwt from 'jsonwebtoken'

import createUserModel from '../models/user'
import { connectToDatabase } from '../utils/db'


module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
	const { authorization } = req.headers

	try {
		const credentials = jwt.verify(authorization, process.env.JWT_KEY)

		if (!credentials) {
			res.status(401).json({error: 'Token jest nieprawidłowy'})
			return
		}

		const User = await createUserModel(process.env.MONGODB_URI)
		const user = await User.findOne({ _id: credentials._id, 'tokens.token': authorization })

		if (!user) {
			res.status(401).json({error: 'Nieautoryzowany'})
			return
		}

		user.tokens = user.tokens.filter((token) => {
			return token.token != authorization
		})
		await user.save()

		res.status(200).json({ status: 'ok' })
	} catch (error) {
		res.status(500).json({error})
	}
}