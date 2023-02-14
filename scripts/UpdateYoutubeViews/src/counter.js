const { google } = require('googleapis')

const { OAuthClient, refresh, auth } = require('./auth')

const youtube = google.youtube('v3')

async function sync(videoId) {
	try {
		await new Promise(function (resolve, reject) {
			youtube.videos
				.list({
					auth: OAuthClient,
					part: ['statistics', 'snippet'],
					id: videoId,
				})
				.then(function (res) {
					const video = res.data?.items?.pop()

					const newCount = video?.statistics?.viewCount
					const title = video?.snippet.title

					try {
						const oldCount = title.match(/Bu video (.*) kez izlendi/)[1]
						if (oldCount === newCount) return resolve()
					} catch (error) {
						// ignore
					}

					youtube.videos
						.update({
							auth: OAuthClient,
							part: 'snippet',
							requestBody: {
								id: videoId,
								snippet: {
									categoryId: video.snippet.categoryId,
									title: `Bu video ${newCount} kez izlendi`,
									description: video.snippet.description,
								},
							},
						})
						.then(resolve)
						.catch(reject)
				})
				.catch(reject)
		})
	} catch (error) {
		await refresh()
	}
}

module.exports = async videoId => {
	await auth()
	await sync(videoId)
}
