const fs = require('fs')
class DownloadTask {

    constructor(oss, record, localPath) {
        this.oss = oss
        this.loaded = 0
        this.record = record
        this.status = 'waiting'
        this.localPath = localPath
        this.key = `${localPath}/${record.fileName}`
    }

    async start() {
        let tempSize = 0
        this.setStatus('downloading')
        const result = await this.oss.getStream(`${this.record.realPath}/${this.record.realName}`)
        const writeStream = fs.createWriteStream(`${this.localPath}.downloading`)
        writeStream.on('finish', () => {
            fs.rename(`${this.localPath}.downloading`, this.localPath, err => {
                if (err) throw err
                this.setStatus('finish')
            })
        })
        result.stream.on('data', (chunk) => {
            tempSize += chunk.length
            this.setLoaded(tempSize)
        })
        result.stream.pipe(writeStream)
    }

    setStatus(status) {
        this.status = status
    }

    getStatus() {
        return this.status
    }

    setLoaded(loaded) {
        this.loaded = loaded
    }

    getLoaded() {
        return (this.loaded / this.record.size) * 100
    }

}

exports.DownloadTask = DownloadTask

