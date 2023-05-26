module.exports = {
	apps: [
		{
			name: 'ceku',
			script: 'node index.js',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
}
