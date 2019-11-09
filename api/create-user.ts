import { NowRequest, NowResponse } from '@now/node'

import createUserModel from '../models/user'
import createProgressModel from '../models/progress'

module.exports = async (req: NowRequest, res: NowResponse): Promise<void> => {
	try {
		const User = await createUserModel(process.env.MONGODB_URI)
		const Progress = await createProgressModel(process.env.MONGODB_URI)

		const user = new User(req.body)
		const progress = new Progress({username: req.body.username})

		await user.save()
		await progress.save()

		const token = await user.generateAuthToken()

		res.status(201).send({ user, token })
	} catch (error) {
		if (error.code === 11000) {
			res.status(409).send({error: 'Ten użytkownik już istnieje'})
			return
		}

		res.status(400).send(error)
	}
}