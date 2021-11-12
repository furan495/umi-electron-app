const fetch = require('node-fetch')

exports.request = async (uri, options) => {
    const extra = options.body ? { body: JSON.stringify(options.body) } : {}
    const response = await fetch(`http://test-mis.annuoyun.net/annoroad-cloud-mis-server/${uri}`, {
        ...extra,
        method: options?.method ?? 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return await response.json()
}