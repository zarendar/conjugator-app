import url from 'url'
import { MongoClient } from 'mongodb'
import mongoose from 'mongoose'

let cachedDb = null
let cachedMongoose = null

export async function connectToDatabase(uri) {
	if (cachedDb) {
		return cachedDb
	}

	const client = await MongoClient.connect(uri, { useNewUrlParser: true })
	const db = await client.db(url.parse(uri).pathname.substr(1))

	cachedDb = db

	return db
}

export async function connectToDatabaseViaMongoose(uri) {
	if (cachedMongoose) {
		return cachedMongoose
	}

	const client = mongoose.connect(uri, {
		useNewUrlParser: true,
		useCreateIndex: true,
	})

	cachedMongoose = client

	return client
}