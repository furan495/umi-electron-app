const OSS = require('ali-oss')
const { request } = require('./request')

exports.initOss = async () => {
    const response = await request('data/assume/role', { prefix: 'oss', method: 'POST' })
    const client = new OSS({
        endpoint: response.data.endpoint,
        accessKeyId: response.data.accessKeyId,
        accessKeySecret: response.data.accessKeySecret,
        stsToken: response.data.securityToken,
        bucket: response.data.bucketName
    })
    return client
}