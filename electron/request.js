const fetch = require('node-fetch')

exports.request = async (uri, options) => {
    const auth = btoa(`${options.name}:${options.pwd}`)
    const extra = options.body ? { body: JSON.stringify(options.body) } : {}
    const hostname = {
        jira: 'http://jira.annoroad.com/rest/api/2/',
        oss: 'http://test-mis.annuoyun.net/annoroad-cloud-mis-server/'
    }
    const response = await fetch(`${hostname[options.prefix] ?? ''}${uri}`, {
        ...extra,
        method: options?.method ?? 'GET',
        headers: {
            'token': '5rh820t+HWiNwYWuUY/mgx99N4O0n9XsOCdQC+ac1Pw=',
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
        }
    })

    return await options.blob ? response.blob() : response.json()
}