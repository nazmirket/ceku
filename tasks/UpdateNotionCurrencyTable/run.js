const TaskConfig = require('./configs.json')

const Axios = require('../../utils/Axios')
const OpenExchangeRates = require('../../config/OpenExchangeRates.json')
const NotionClient = require('../../utils/NotionClient')

const getRate = async () => {
   const response = await Axios.get(OpenExchangeRates.endpoints['USD/TRY'], {
      params: { app_id: OpenExchangeRates.AppID },
   })
   return response.data?.rates?.TRY
}

;(async () => {
   const rate = await getRate()
   await NotionClient.pages.update({
      page_id: TaskConfig.PageID,
      properties: { 'USD Rate': rate },
   })
})()
