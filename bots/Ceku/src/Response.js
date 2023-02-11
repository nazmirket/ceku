const { readdir, readFile } = require('fs').promises

const { words } = require('./Responses.json')

const GifRoot = [process.cwd(), 'public', 'gifs'].join('/')
const VidRoot = [process.cwd(), 'public', 'videos'].join('/')

const Renderer = require('../templates/Renderer')

const sources = {
	gifs: {},
	imgs: {},
	vids: {},
}

async function content(dir) {
	try {
		const files = await readdir(dir, { withFileTypes: true })
		return files.map((f) => [dir, f.name].join('/'))
	} catch (e) {
		return []
	}
}

module.exports.init = async function () {
	// init gifs
	for (const { word, fallback } of words) {
		const root = [GifRoot, word].join('/')
		const files = await content(root)
		sources.gifs[word] = { list: files, fallback }
	}

	// init videos
	for (const { word, fallback } of words) {
		const root = [VidRoot, word].join('/')
		const files = await content(root)
		sources.vids[word] = { list: files, fallback }
	}
}

function rand(list) {
	return list[Math.floor(Math.random() * list.length)]
}

module.exports.gif = async function (word) {
	const source = sources.gifs[word]
	if (!source) return { type: 'txt', data: word }
	const gif = rand(source.list)
	if (!gif) return { type: 'txt', data: source.fallback }
	return { type: 'gif', data: gif }
}

module.exports.vid = async function (word) {
	const source = sources.vids[word]
	if (!source) return { type: 'txt', data: word }
	const vid = rand(source.list)
	if (!vid) return { type: 'txt', data: source.fallback }
	return { type: 'vid', data: vid }
}

module.exports.list = async function (items, { head, foot, format }) {
	const data = {
		head: head || '',
		foot: foot || '',
		list:
			items.length > 0
				? (format ? items.map(format) : items).filter((l) => l)
				: ['Henüz veri yok.'],
	}
	return {
		type: 'html',
		data: await Renderer('list', data),
	}
}

module.exports.page = async function (pageName) {
	return {
		type: 'html',
		data: await readFile(`${__dirname}/../pages/${pageName}.html`, 'utf8'),
	}
}

module.exports.plain = async function (text) {
	return {
		type: 'txt',
		data: `${text}`,
	}
}

module.exports.prepared = {
	notConfirmed: () => ({
		type: 'txt',
		data: 'Bu komutu kullanabilmek için önce /dogrula komutunu kullanmalısın.',
	}),
	invoice: (amount, label) => ({
		type: 'txt',
		data: `Gider Eklendi: ${label}, ${amount}₺`,
	}),
	receipt: (amount) => ({
		type: 'txt',
		data: `Ödemen Kaydedildi: ${amount}₺`,
	}),
	debt: (amount) => ({
		type: 'txt',
		data: `Borcun ${amount}₺`,
	}),
}
