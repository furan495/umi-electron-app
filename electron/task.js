const fs = require('fs')
class DownloadTask {

    constructor(oss, record, localPath) {
        this.oss = oss
        this.loaded = 0
        this.record = record
        this.status = 'waiting'
        this.localPath = localPath
        this.startTime = new Date().getTime()
    }

    async start() {
        let tempSize = 0
        this.status = 'downloading'
        this.startTime = new Date().getTime()
        const result = await this.oss.getStream(`${this.record.realPath}/${this.record.realName}`)
        const writeStream = fs.createWriteStream(`${this.localPath}.downloading`)
        writeStream.on('finish', () => {
            fs.rename(`${this.localPath}.downloading`, this.localPath, err => {
                if (err) throw err
                this.status = 'finish'
            })
        })
        result.stream.on('data', (chunk) => {
            tempSize += chunk.length
            this.loaded = tempSize
        })
        result.stream.pipe(writeStream)
    }

    getSpeed() {
        const curTime = new Date().getTime()
        const deltaTime = (curTime - this.startTime) / 1000
        return this.loaded / deltaTime
    }

}

exports.DownloadTask = DownloadTask

