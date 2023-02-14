/* eslint-disable no-console */
const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')

const path = require('path')

const credentials = require('./credentials.json')

const OAuthClient = new google.auth.OAuth2({
	clientId: credentials.client_id,
	clientSecret: credentials.client_secret,
	redirectUri: credentials.redirect_uris[0],
})

const TOKEN_PATH = path.join(__dirname, 'token.json')

async function load() {
	try {
		const stored = JSON.parse(await fs.promises.readFile(TOKEN_PATH))
		if (stored.access_token) {
			OAuthClient.credentials = stored
			return true
		}
		return false
	} catch (e) {
		return false
	}
}

async function save(data) {
	await fs.promises.writeFile(TOKEN_PATH, JSON.stringify(data))
}

async function auth() {
	const isLoaded = await load()
	if (isLoaded) return

	await new Promise(function (resolve, reject) {
		const uri = OAuthClient.generateAuthUrl({
			access_type: 'offline',
			scope: 'https://www.googleapis.com/auth/youtube',
		})
		console.log(decodeURIComponent(uri))

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		})

		rl.question('code: ', async function (code) {
			rl.close()
			try {
				const { res } = await OAuthClient.getToken(decodeURIComponent(code))
				await save(res.data)
				await load()
				resolve()
			} catch (error) {
				console.log(error)
				reject(error)
			}
		})
	})
}

async function refresh() {
	const { res } = await OAuthClient.refreshAccessToken()
	await save(res.data)
}

module.exports.OAuthClient = OAuthClient
module.exports.auth = auth
module.exports.refresh = refresh
