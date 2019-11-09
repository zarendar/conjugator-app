import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import  validator from 'validator'

import { connectToDatabaseViaMongoose } from '../utils/db'

let model = null

export default async function createUserModel(uri) {
	if (model) {
		return model
	}

	const mongoose = await connectToDatabaseViaMongoose(uri)

	const userSchema = mongoose.Schema({
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			validate: value => {
				if (!validator.isAlphanumeric(value)) {
					throw new Error('powinien zawierać tylko litery i cyfry.')
				}
			}
		},
		password: {
			type: String,
			required: true,
			minLength: 6
		},
		tokens: [{
			token: {
				type: String,
				required: true
			}
		}]
	})

	userSchema.pre('save', async function (next) {
	// Hash the password before saving the user model
	// eslint-disable-next-line @typescript-eslint/no-this-alias
		const user = this
		if (user.isModified('password')) {
			user.password = await bcrypt.hash(user.password, 8)
		}
		next()
	})

	userSchema.methods.generateAuthToken = async function() {
	// Generate an auth token for the user
	// eslint-disable-next-line @typescript-eslint/no-this-alias
		const user = this
		const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
		user.tokens = user.tokens.concat({token})
		await user.save()
		return token
	}

	userSchema.statics.findByCredentials = async (username, password) => {
	// Search for a user by email and password.
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const user = await UserModel.findOne({ username })

		if (!user) {
			return null
		}

		const isPasswordMatch = await bcrypt.compare(password, user.password)

		if (!isPasswordMatch) {
			return null
		}

		return user
	}

	const UserModel = mongoose.model('User', userSchema)

	model = UserModel

	return UserModel
}