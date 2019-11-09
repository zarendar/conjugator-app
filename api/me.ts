import { NowRequest, NowResponse } from '@now/node'
import jwt from 'jsonwebtoken'

import createUserModel from '../models/user'

module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
	const { authorization } = req.headers

	if (!authorization) {
		res.status(401).json('Nieautoryzowany')
	}

	try {
		const credentials = jwt.verify(authorization, process.env.JWT_KEY)

		if (!credentials) {
			res.status(401).json({error: 'Token jest nieprawidłowy'})
			return
		}

		const User = await createUserModel(process.env.MONGODB_URI)
		const user = await User.findOne({_id: credentials._id, 'tokens.token': authorization})

		res.json({ user })
	} catch (error) {
		res.status(400).json({error})
	}
}