module.exports = {
	apps: [
		{
			name: 'ceku',
			script: 'node ./bots/Ceku',
			env: {
				NODE_ENV: 'production',
			},
		},
		{
			name: 'yt-counter',
			script: 'node ./scripts/UpdateYoutubeViews',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
}
