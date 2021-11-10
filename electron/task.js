const fs = require('fs')

class DownloadTask {

    constructor(oss, record, localPath) {
        this.oss = oss
        this.record = record
        this.localPath = localPath
    }

    async start() {
        const result = await this.oss.getStream(`${this.record.realPath}/${this.record.realName}`)
        const writeStream = fs.createWriteStream(this.localPath)
        result.stream.pipe(writeStream)
    }

}

exports.DownloadTask = DownloadTask

