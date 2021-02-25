const { default: Axios } = require("axios")

const BASE_URL = 'http://otpsim.com'
// const API_KEY = 'c40a0f217eaa7c6168b646326048a150'
const GAPO_SERVICE_ID = 148

const axios = require('axios')

const _getAvailableService = async (API_KEY) => {
    const response = await axios.get(`${BASE_URL}/api/v2/available-services?apiKey=${API_KEY}`)
    return response.data
}

const _createGapoOrder = async (API_KEY) => {
    const response = await axios.get(`${BASE_URL}/api/phones/request?token=${API_KEY}&service=${GAPO_SERVICE_ID}&network=2`)
    return response.data
}

const _getGapoServiceMessage = async (API_KEY, orderId) => {
    if (!orderId) throw new Error('Order ID not found.')

    const response = await axios.get(`${BASE_URL}/api/sessions/${orderId}?token=${API_KEY}`)

    return response.data
}

module.exports = {
    _getAvailableService,
    _getGapoServiceMessage,
    _createGapoOrder,
}
