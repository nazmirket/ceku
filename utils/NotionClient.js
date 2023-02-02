const NotionConfig = require('../config/Notion.json')
const { Client } = require('@notionhq/client')
module.exports = new Client({ auth: NotionConfig.IntegrationToken })
