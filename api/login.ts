import { NowRequest, NowResponse } from '@now/node'
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