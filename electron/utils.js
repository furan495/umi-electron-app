const fs = require('fs')
const OSS = require('ali-oss')
const { request } = require('./request')
const { DownloadTask } = require('./task')

exports.initOss = async () => {
    const response = await request('data/assume/role', { method: 'POST' })
    const client = new OSS({
        endpoint: response.data.endpoint,
        accessKeyId: response.data.accessKeyId,
        accessKeySecret: response.data.accessKeySecret,
        stsToken: response.data.securityToken,
        bucket: response.data.bucketName
    })
    return client
}

const loopFolder = async (oss, record, localPath) => {
    const response = await request('data/find', { method: 'POST', body: { prefix: `${record.path ?? ''}${record.path ? '/' : ''}${record.fileName}`, searchName: '', isMyData: '' } })
    fs.mkdir(localPath, { recursive: true }, (err) => {
        if (err) throw err
        response.data.folders.forEach(folder => loopFolder(oss, folder, `${localPath}/${folder.fileName}`))
        response.data.files.forEach(file => {
            const task = new DownloadTask(oss, file, `${localPath}/${file.fileName}`)
            task.start()
        })
    })
}

exports.loopFolder = loopFolder