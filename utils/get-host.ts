export default function getHost(req) {
	if (!req) return ''

	const { host } = req.headers

	if (host.startsWith('localhost')) {
		return 'http://localhost:3000'
	}
	return `https://${host}`
}