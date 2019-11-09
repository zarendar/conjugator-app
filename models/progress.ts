import { connectToDatabaseViaMongoose } from '../utils/db'

let model = null

export default async function createProgressModel(uri) {
	if (model) {
		return model
	}

	const mongoose = await connectToDatabaseViaMongoose(uri)

	const schema = mongoose.Schema({
		username: {
			type: String,
			required: true,
			trim: true
		},
		present: [],
		past: [],
	})

	const ProgressModel = mongoose.model('Progress', schema)

	model = ProgressModel

	return ProgressModel
}