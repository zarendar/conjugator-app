import url from 'url'
import { MongoClient } from 'mongodb'

let cachedDb = null

export async function connectToDatabase(uri) {
	if (cachedDb) {
		return cachedDb
	}

	const client = await MongoClient.connect(uri, { useNewUrlParser: true })
	const db = await client.db(url.parse(uri).pathname.substr(1))

	cachedDb = db

	return db
}